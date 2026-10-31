import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---------------------------------------------------------------------------
// Конфигурация и ограничения
// ---------------------------------------------------------------------------

const ALLOWED_ORIGINS = new Set([
  'https://msuvenirov.ru',
  'http://localhost:4321',
  'http://127.0.0.1:4321',
]);

const MAX_FILES = 10;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50 MB
// Небольшой запас сверху на multipart-обвязку и текстовые поля.
const MAX_BODY_SIZE = MAX_TOTAL_SIZE + 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'webp', 'heic', 'pdf', 'ai', 'eps', 'cdr', 'psd',
  'svg', 'tif', 'tiff', 'zip', 'rar', '7z', 'docx', 'xlsx', 'txt',
]);

const CONTACT_METHODS: Record<string, string> = {
  phone: 'Звонок по телефону',
  telegram: 'Telegram',
  max: 'MAX',
  whatsapp: 'WhatsApp',
  vk: 'ВКонтакте',
};

const MIN_ELAPSED_MS = 2500;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const TG_MESSAGE_LIMIT = 4000; // реальный лимит Telegram — 4096, оставляем запас
const TG_CAPTION_LIMIT = 1024;

const MSG_INVALID = 'Проверьте правильность заполнения формы и попробуйте ещё раз.';
const MSG_FILES = 'Не удалось принять файлы: допустимы файлы до 20 МБ (всего до 50 МБ) в распространённых форматах.';
const MSG_RATE = 'Слишком много заявок с вашего адреса. Пожалуйста, попробуйте позже или позвоните нам.';
const MSG_SERVER = 'Не удалось отправить заявку. Пожалуйста, позвоните нам или попробуйте позже.';

// ---------------------------------------------------------------------------
// Вспомогательные функции
// ---------------------------------------------------------------------------

function buildCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Vary': 'Origin',
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] =
      'authorization, x-client-info, apikey, content-type';
    headers['Access-Control-Max-Age'] = '86400';
  }
  return headers;
}

function json(
  body: Record<string, unknown>,
  status: number,
  cors: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Удаляет управляющие символы (кроме \n и \t, если keepNewlines).
function clean(s: string, keepNewlines = false): string {
  const re = keepNewlines
    // deno-lint-ignore no-control-regex
    ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
    // deno-lint-ignore no-control-regex
    : /[\u0000-\u001F\u007F]/g;
  return s.replace(re, keepNewlines ? '' : ' ');
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === 'string' ? v : '';
}

function truncate(s: string, max: number): string {
  const chars = Array.from(s);
  return chars.length <= max ? s : chars.slice(0, Math.max(0, max - 1)).join('') + '…';
}

function fmtNum(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  const [int, frac] = Math.abs(rounded).toString().split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (rounded < 0 ? '-' : '') + grouped + (frac ? ',' + frac : '');
}

function redact(text: string, secrets: Array<string | undefined>): string {
  let out = text;
  for (const s of secrets) {
    if (s) out = out.split(s).join('***');
  }
  return out;
}

function getClientIp(req: Request): string | null {
  const cf = req.headers.get('cf-connecting-ip');
  const xff = req.headers.get('x-forwarded-for');
  const raw = (cf && cf.trim()) || (xff ? xff.split(',')[0].trim() : '');
  if (!raw) return null;
  return raw.slice(0, 64);
}

function fileExtension(name: string): string {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i + 1).toLowerCase() : '';
}

function safeFileName(name: string): string {
  // только базовое имя, без путей и управляющих символов
  const base = clean(name).split(/[\\/]/).pop() ?? '';
  const trimmed = base.trim().replace(/^\.+/, '');
  if (!trimmed) return 'file';
  const ext = fileExtension(trimmed);
  if (trimmed.length <= 100) return trimmed;
  return trimmed.slice(0, 90) + (ext ? '.' + ext : '');
}

// ---------------------------------------------------------------------------
// Типы и валидация
// ---------------------------------------------------------------------------

interface EstimateItem {
  title: string;
  details: string;
  qty: number;
  unitPrice: number;
  total: number;
}

interface Order {
  name: string;
  phone: string;
  contactMethod: string;
  email: string;
  comment: string;
  estimate: EstimateItem[];
  estimateTotal: number | null;
  page: string;
}

function finiteNumber(v: unknown, max = 1e10): number | null {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > max) return null;
  return v;
}

function parseEstimate(raw: string): EstimateItem[] | null {
  if (!raw.trim()) return [];
  if (raw.length > 30000) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed) || parsed.length > 30) return null;
  const items: EstimateItem[] = [];
  for (const it of parsed) {
    if (!it || typeof it !== 'object') return null;
    const o = it as Record<string, unknown>;
    if (typeof o.title !== 'string' || o.title.length > 120) return null;
    const details = o.details === undefined || o.details === null ? '' : o.details;
    if (typeof details !== 'string' || details.length > 300) return null;
    const qty = finiteNumber(o.qty);
    const unitPrice = finiteNumber(o.unitPrice);
    const total = finiteNumber(o.total);
    if (qty === null || unitPrice === null || total === null) return null;
    items.push({
      title: clean(o.title).trim(),
      details: clean(details).trim(),
      qty,
      unitPrice,
      total,
    });
  }
  return items;
}

function parseOrder(form: FormData): Order | null {
  const name = clean(str(form.get('name'))).trim();
  if (name.length < 1 || name.length > 80) return null;

  const phone = clean(str(form.get('phone'))).trim();
  if (phone.length < 10 || phone.length > 20) return null;
  if (!/^[0-9+()\-\s]+$/.test(phone)) return null;
  if (phone.replace(/\D/g, '').length < 10) return null;

  const contactMethod = str(form.get('contact_method')).trim().toLowerCase() || 'phone';
  if (!(contactMethod in CONTACT_METHODS)) return null;

  const email = clean(str(form.get('email'))).trim();
  if (email) {
    if (email.length > 120) return null;
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(email)) return null;
  }

  const comment = clean(str(form.get('comment')), true).trim();
  if (comment.length > 2000) return null;

  const estimate = parseEstimate(str(form.get('estimate')));
  if (estimate === null) return null;

  let estimateTotal: number | null = null;
  const totalRaw = str(form.get('estimate_total')).trim();
  if (totalRaw) {
    const n = Number(totalRaw);
    const v = finiteNumber(n);
    if (v === null) return null;
    estimateTotal = v;
  } else if (estimate.length > 0) {
    estimateTotal = estimate.reduce((sum, it) => sum + it.total, 0);
  }

  const page = clean(str(form.get('page'))).trim();
  if (page.length > 200) return null;

  return { name, phone, contactMethod, email, comment, estimate, estimateTotal, page };
}

// ---------------------------------------------------------------------------
// Формирование сообщения для Telegram (HTML)
// ---------------------------------------------------------------------------

function renderMessage(o: Order, maxLines: number, maxComment: number): string {
  const e = escapeHtml;
  const parts: string[] = [];
  parts.push('<b>Новая заявка с сайта</b>');
  parts.push('');
  parts.push(`<b>Имя:</b> ${e(o.name)}`);
  parts.push(`<b>Телефон:</b> ${e(o.phone)}`);
  parts.push(`<b>Предпочтительная связь:</b> ${e(CONTACT_METHODS[o.contactMethod])}`);
  if (o.email) parts.push(`<b>Email:</b> ${e(o.email)}`);

  if (o.estimate.length > 0) {
    parts.push('');
    parts.push('<b>Смета:</b>');
    for (const it of o.estimate.slice(0, maxLines)) {
      const details = it.details ? ` — ${e(it.details)}` : '';
      parts.push(
        `• ${e(it.title)}${details} — ${fmtNum(it.qty)} шт × ${fmtNum(it.unitPrice)} ₽ = ${fmtNum(it.total)} ₽`,
      );
    }
    if (o.estimate.length > maxLines) {
      parts.push(`… и ещё позиций: ${o.estimate.length - maxLines} (полный список сохранён в базе)`);
    }
    if (o.estimateTotal !== null) {
      parts.push(`<b>Итого по смете: ${fmtNum(o.estimateTotal)} ₽</b>`);
    }
  }

  if (o.comment) {
    parts.push('');
    parts.push(`<b>Комментарий:</b> ${e(truncate(o.comment, maxComment))}`);
  }
  if (o.page) {
    parts.push('');
    parts.push(`<b>Страница:</b> ${e(o.page)}`);
  }
  return parts.join('\n');
}

function buildMessage(o: Order): string {
  let maxLines = o.estimate.length;
  let maxComment = o.comment.length;

  for (let guard = 0; guard < 200; guard++) {
    const text = renderMessage(o, maxLines, maxComment);
    if (text.length <= TG_MESSAGE_LIMIT) return text;
    if (maxComment > 300) {
      maxComment = Math.max(300, Math.floor(maxComment / 2));
    } else if (maxLines > 0) {
      maxLines -= 1;
    } else if (maxComment > 0) {
      maxComment = 0;
    } else {
      break;
    }
  }
  // Минимальный вариант заведомо короткий; на всякий случай — жёсткая обрезка без тегов.
  return truncate(renderMessage({ ...o, comment: '', estimate: [] }, 0, 0), TG_MESSAGE_LIMIT);
}

// ---------------------------------------------------------------------------
// Telegram API
// ---------------------------------------------------------------------------

async function tgJson(
  token: string,
  method: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok || !result.ok) {
    throw new Error(`Telegram ${method}: ${result.description ?? res.status}`);
  }
}

async function tgDocument(
  token: string,
  chatId: string,
  file: File,
  fileName: string,
  caption?: string,
): Promise<void> {
  const form = new FormData();
  form.append('chat_id', chatId);
  if (caption) {
    form.append('caption', caption);
    form.append('parse_mode', 'HTML');
  }
  form.append('document', file, fileName);
  const res = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
    method: 'POST',
    body: form,
    signal: AbortSignal.timeout(90000),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok || !result.ok) {
    throw new Error(`Telegram sendDocument: ${result.description ?? res.status}`);
  }
}

async function sendToTelegram(
  token: string,
  chatId: string,
  text: string,
  files: Array<{ file: File; name: string }>,
): Promise<void> {
  if (files.length === 1 && text.length <= TG_CAPTION_LIMIT) {
    await tgDocument(token, chatId, files[0].file, files[0].name, text);
    return;
  }

  await tgJson(token, 'sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });

  for (const f of files) {
    await tgDocument(token, chatId, f.file, f.name);
  }
}

// ---------------------------------------------------------------------------
// Обработчик
// ---------------------------------------------------------------------------

serve(async (req) => {
  const origin = req.headers.get('origin');
  const cors = buildCorsHeaders(origin);
  const originAllowed = 'Access-Control-Allow-Origin' in cors;

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: originAllowed ? 204 : 403, headers: cors });
  }

  if (req.method !== 'POST') {
    return json({ success: false, error: MSG_INVALID }, 405, cors);
  }

  // Браузерные запросы с чужого Origin не обрабатываем.
  if (origin && !originAllowed) {
    return json({ success: false, error: MSG_INVALID }, 403, cors);
  }

  const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const secrets = [BOT_TOKEN, SERVICE_ROLE_KEY];

  try {
    const contentLength = Number(req.headers.get('content-length') ?? '0');
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_SIZE) {
      return json({ success: false, error: MSG_FILES }, 400, cors);
    }

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return json({ success: false, error: MSG_INVALID }, 400, cors);
    }

    // Антибот: honeypot и слишком быстрая отправка — молча «успех».
    if (str(form.get('website')).trim() !== '') {
      return json({ success: true }, 200, cors);
    }
    const elapsedRaw = str(form.get('elapsed_ms')).trim();
    if (elapsedRaw !== '') {
      const elapsed = Number(elapsedRaw);
      if (!Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_MS) {
        return json({ success: true }, 200, cors);
      }
    }

    const order = parseOrder(form);
    if (!order) {
      return json({ success: false, error: MSG_INVALID }, 400, cors);
    }

    // Файлы
    let fileCount = parseInt(str(form.get('fileCount')) || '0', 10);
    if (!Number.isFinite(fileCount) || fileCount < 0) fileCount = 0;
    fileCount = Math.min(fileCount, MAX_FILES);

    const files: Array<{ file: File; name: string }> = [];
    let totalSize = 0;
    for (let i = 0; i < fileCount; i++) {
      const value = form.get(`file_${i}`);
      if (value === null || typeof value === 'string') continue;
      const file = value as File;
      if (file.size <= 0) continue;
      const name = safeFileName(file.name || 'file');
      if (!ALLOWED_EXTENSIONS.has(fileExtension(name))) {
        return json({ success: false, error: MSG_FILES }, 400, cors);
      }
      if (file.size > MAX_FILE_SIZE) {
        return json({ success: false, error: MSG_FILES }, 400, cors);
      }
      totalSize += file.size;
      if (totalSize > MAX_TOTAL_SIZE) {
        return json({ success: false, error: MSG_FILES }, 400, cors);
      }
      files.push({ file, name });
    }

    // Supabase (сервисная роль) — необязателен для отправки, но желателен.
    const supabase = SUPABASE_URL && SERVICE_ROLE_KEY
      ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
      : null;
    if (!supabase) console.error('send-telegram: Supabase env is not configured');

    const ip = getClientIp(req);

    // Лимит: не более 5 заявок с одного IP за 10 минут.
    if (supabase && ip) {
      try {
        const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
        const { count, error } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('ip', ip)
          .gte('created_at', since);
        if (error) {
          console.error('send-telegram: rate limit query failed:', redact(error.message ?? '', secrets));
        } else if ((count ?? 0) >= RATE_LIMIT_MAX) {
          return json({ success: false, error: MSG_RATE }, 429, cors);
        }
      } catch (e) {
        console.error('send-telegram: rate limit error:', redact(String(e), secrets));
      }
    }

    // Сначала сохраняем заявку в базу.
    let orderId: string | null = null;
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert({
            name: order.name,
            phone: order.phone,
            contact_method: order.contactMethod,
            email: order.email || null,
            comment: order.comment || null,
            estimate: order.estimate.length > 0 ? order.estimate : null,
            estimate_total: order.estimateTotal,
            page: order.page || null,
            file_names: files.map((f) => f.name),
            ip,
          })
          .select('id')
          .single();
        if (error) {
          console.error('send-telegram: order insert failed:', redact(error.message ?? '', secrets));
        } else {
          orderId = data?.id ?? null;
        }
      } catch (e) {
        console.error('send-telegram: order insert error:', redact(String(e), secrets));
      }
    }

    // Отправка в Telegram.
    let telegramOk = false;
    let telegramError: string | null = null;
    if (!BOT_TOKEN || !CHAT_ID) {
      telegramError = 'telegram credentials are not configured';
      console.error('send-telegram:', telegramError);
    } else {
      try {
        await sendToTelegram(BOT_TOKEN, CHAT_ID, buildMessage(order), files);
        telegramOk = true;
      } catch (e) {
        telegramError = redact(e instanceof Error ? e.message : String(e), secrets).slice(0, 500);
        console.error('send-telegram: telegram failed:', telegramError);
      }
    }

    if (supabase && orderId) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ telegram_ok: telegramOk, telegram_error: telegramError })
          .eq('id', orderId);
        if (error) {
          console.error('send-telegram: order update failed:', redact(error.message ?? '', secrets));
        }
      } catch (e) {
        console.error('send-telegram: order update error:', redact(String(e), secrets));
      }
    }

    if (orderId || telegramOk) {
      return json({ success: true }, 200, cors);
    }
    return json({ success: false, error: MSG_SERVER }, 500, cors);
  } catch (e) {
    console.error('send-telegram: unexpected error:', redact(e instanceof Error ? e.message : String(e), secrets));
    return json({ success: false, error: MSG_SERVER }, 500, cors);
  }
});

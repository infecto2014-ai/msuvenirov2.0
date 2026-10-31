import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CALLBACK_RE = /^(approve|reject)_([0-9a-f-]{36})$/i;

// Сравнение строк за постоянное время (длина секрета не секретна).
function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

function parseAdminIds(raw: string | undefined): Set<string> {
  return new Set(
    (raw ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => /^-?\d+$/.test(s)),
  );
}

function redact(text: string, secrets: Array<string | undefined>): string {
  let out = text;
  for (const s of secrets) {
    if (s) out = out.split(s).join('***');
  }
  return out;
}

async function tgCall(token: string, method: string, payload: Record<string, unknown>) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.error(`telegram-review-webhook: ${method} failed with status ${res.status}`);
    }
  } catch (e) {
    console.error(`telegram-review-webhook: ${method} error:`, redact(String(e), [token]));
  }
}

serve(async (req) => {
  const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const WEBHOOK_SECRET = Deno.env.get('TELEGRAM_WEBHOOK_SECRET');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const secrets = [BOT_TOKEN, WEBHOOK_SECRET, SERVICE_ROLE_KEY];

  // 1. Подлинность запроса: секрет, заданный при setWebhook (secret_token).
  const provided = req.headers.get('X-Telegram-Bot-Api-Secret-Token') ?? '';
  if (!WEBHOOK_SECRET || !safeEqual(provided, WEBHOOK_SECRET)) {
    return new Response('Forbidden', { status: 403 });
  }

  if (req.method !== 'POST') {
    return new Response('OK', { status: 200 });
  }

  try {
    if (!BOT_TOKEN || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
      console.error('telegram-review-webhook: missing environment variables');
      return new Response('OK', { status: 200 });
    }

    const update = await req.json();
    const callbackQuery = update?.callback_query;
    if (!callbackQuery) {
      return new Response('OK', { status: 200 });
    }

    const callbackQueryId = String(callbackQuery.id ?? '');

    // 2. Только администраторы из TELEGRAM_ADMIN_IDS.
    const adminIds = parseAdminIds(Deno.env.get('TELEGRAM_ADMIN_IDS'));
    const fromId = callbackQuery.from?.id;
    if (fromId === undefined || fromId === null || !adminIds.has(String(fromId))) {
      console.error('telegram-review-webhook: callback from non-admin user rejected');
      if (callbackQueryId) {
        await tgCall(BOT_TOKEN, 'answerCallbackQuery', {
          callback_query_id: callbackQueryId,
          text: 'Нет доступа',
        });
      }
      return new Response('OK', { status: 200 });
    }

    // 3. Разбор callback_data: approve_<uuid> | reject_<uuid>.
    const data = typeof callbackQuery.data === 'string' ? callbackQuery.data : '';
    const match = CALLBACK_RE.exec(data);
    if (!match || !UUID_RE.test(match[2])) {
      return new Response('OK', { status: 200 });
    }
    const isApprove = match[1].toLowerCase() === 'approve';
    const reviewId = match[2].toLowerCase();

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Отклонение — это is_approved=false, запись не удаляется.
    const { data: rows, error } = await supabase
      .from('reviews')
      .update({ is_approved: isApprove })
      .eq('id', reviewId)
      .select('id');

    if (error) {
      console.error('telegram-review-webhook: db error:', redact(error.message ?? '', secrets));
      await tgCall(BOT_TOKEN, 'answerCallbackQuery', {
        callback_query_id: callbackQueryId,
        text: 'Ошибка, попробуйте позже',
      });
      return new Response('OK', { status: 200 });
    }

    if (!rows || rows.length === 0) {
      await tgCall(BOT_TOKEN, 'answerCallbackQuery', {
        callback_query_id: callbackQueryId,
        text: 'Отзыв не найден',
      });
      return new Response('OK', { status: 200 });
    }

    await tgCall(BOT_TOKEN, 'answerCallbackQuery', {
      callback_query_id: callbackQueryId,
      text: isApprove ? '✅ Отзыв одобрен!' : '❌ Отзыв отклонён.',
    });

    // Дописываем статус к сообщению и убираем кнопки.
    const messageId = callbackQuery.message?.message_id;
    const chatId = callbackQuery.message?.chat?.id;
    if (chatId && messageId) {
      const originalText = typeof callbackQuery.message?.text === 'string'
        ? callbackQuery.message.text
        : '';
      const statusLine = isApprove ? '\n\n✅ ОДОБРЕНО' : '\n\n❌ ОТКЛОНЕНО';
      await tgCall(BOT_TOKEN, 'editMessageText', {
        chat_id: chatId,
        message_id: messageId,
        text: (originalText + statusLine).slice(0, 4096),
      });
    }

    return new Response('OK', { status: 200 });
  } catch (e) {
    console.error('telegram-review-webhook: error:', redact(e instanceof Error ? e.message : String(e), secrets));
    // 200, чтобы Telegram не повторял обновление бесконечно.
    return new Response('OK', { status: 200 });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Функция вызывается только серверной стороной (триггер БД / другая функция)
// с заголовком x-internal-secret. Браузерный CORS не нужен.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function truncate(s: string, max: number): string {
  const chars = Array.from(s);
  return chars.length <= max ? s : chars.slice(0, max - 1).join('') + '…';
}

function redact(text: string, secrets: Array<string | undefined>): string {
  let out = text;
  for (const s of secrets) {
    if (s) out = out.split(s).join('***');
  }
  return out;
}

function reply(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

serve(async (req) => {
  const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const INTERNAL_SECRET = Deno.env.get('INTERNAL_FUNCTION_SECRET');
  const secrets = [BOT_TOKEN, SERVICE_ROLE_KEY, INTERNAL_SECRET];

  if (req.method !== 'POST') {
    return reply({ success: false, error: 'Method not allowed' }, 405);
  }

  // Внутренний секрет обязателен; если он не настроен — доступ закрыт.
  const provided = req.headers.get('x-internal-secret') ?? '';
  if (!INTERNAL_SECRET || !safeEqual(provided, INTERNAL_SECRET)) {
    return reply({ success: false, error: 'Forbidden' }, 403);
  }

  try {
    if (!BOT_TOKEN || !CHAT_ID || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
      console.error('notify-review: missing environment variables');
      return reply({ success: false, error: 'Internal error' }, 500);
    }

    let body: { review_id?: unknown };
    try {
      body = await req.json();
    } catch {
      return reply({ success: false, error: 'Bad request' }, 400);
    }

    const reviewId = typeof body?.review_id === 'string' ? body.review_id : '';
    if (!UUID_RE.test(reviewId)) {
      return reply({ success: false, error: 'Bad request' }, 400);
    }

    // Данные отзыва берём только из БД, а не из тела запроса.
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: review, error } = await supabase
      .from('reviews')
      .select('id, name, content, rating')
      .eq('id', reviewId.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error('notify-review: db error:', redact(error.message ?? '', secrets));
      return reply({ success: false, error: 'Internal error' }, 500);
    }
    if (!review) {
      return reply({ success: false, error: 'Not found' }, 404);
    }

    const rating = Number(review.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      console.error('notify-review: invalid rating in database');
      return reply({ success: false, error: 'Bad data' }, 422);
    }

    const name = escapeHtml(truncate(String(review.name ?? ''), 80));
    const content = escapeHtml(truncate(String(review.content ?? ''), 2000));
    const stars = '⭐'.repeat(rating);
    const messageText = `${stars} Новый отзыв!\n\n👤 ${name}\n💬 ${content}`;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: messageText,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[
            { text: '✅ Одобрить', callback_data: `approve_${review.id}` },
            { text: '❌ Отклонить', callback_data: `reject_${review.id}` },
          ]],
        },
      }),
      signal: AbortSignal.timeout(20000),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      console.error('notify-review: telegram error:', result?.description ?? response.status);
      return reply({ success: false, error: 'Internal error' }, 502);
    }

    return reply({ success: true }, 200);
  } catch (e) {
    console.error('notify-review: error:', redact(e instanceof Error ? e.message : String(e), secrets));
    return reply({ success: false, error: 'Internal error' }, 500);
  }
});

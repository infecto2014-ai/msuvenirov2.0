import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  'https://msuvenirov.ru',
  'http://localhost:4321',
  'http://127.0.0.1:4321',
]);

const CODE_RE = /^[A-Za-z0-9_-]{1,32}$/;

function buildCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = { 'Vary': 'Origin' };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] =
      'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version';
    headers['Access-Control-Max-Age'] = '86400';
  }
  return headers;
}

function reply(body: Record<string, unknown>, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const cors = buildCorsHeaders(origin);
  const originAllowed = 'Access-Control-Allow-Origin' in cors;

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: originAllowed ? 204 : 403, headers: cors });
  }

  if (req.method !== 'POST') {
    return reply({ valid: false, message: 'Ошибка при проверке промокода' }, 405, cors);
  }

  if (origin && !originAllowed) {
    return reply({ valid: false, message: 'Ошибка при проверке промокода' }, 403, cors);
  }

  try {
    let body: { code?: unknown };
    try {
      body = await req.json();
    } catch {
      return reply({ valid: false, message: 'Ошибка при проверке промокода' }, 400, cors);
    }

    const rawCode = typeof body?.code === 'string' ? body.code.trim() : '';
    if (!rawCode) {
      return reply({ valid: false, message: 'Промокод не указан' }, 200, cors);
    }
    if (!CODE_RE.test(rawCode)) {
      return reply({ valid: false, message: 'Промокод не найден' }, 200, cors);
    }
    const code = rawCode.toUpperCase();

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      console.error('verify-promo: missing Supabase environment variables');
      return reply({ valid: false, message: 'Ошибка при проверке промокода' }, 500, cors);
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase
      .from('promo_codes')
      .select('code, description, valid_until, is_active')
      .eq('code', code)
      .maybeSingle();

    if (error) {
      console.error('verify-promo: db error:', error.message);
      return reply({ valid: false, message: 'Ошибка при проверке промокода' }, 500, cors);
    }

    if (!data) {
      return reply({ valid: false, message: 'Промокод не найден' }, 200, cors);
    }

    if (!data.is_active) {
      return reply({ valid: false, message: 'Промокод больше не действует' }, 200, cors);
    }

    // valid_until == null => бессрочный промокод. Нечитаемая дата => считаем истёкшим.
    if (data.valid_until !== null && data.valid_until !== undefined) {
      const validUntil = new Date(data.valid_until);
      if (Number.isNaN(validUntil.getTime()) || Date.now() > validUntil.getTime()) {
        return reply({ valid: false, message: 'Срок действия промокода истёк' }, 200, cors);
      }
    }

    return reply(
      { valid: true, message: 'Промокод применён!', description: data.description ?? null },
      200,
      cors,
    );
  } catch (e) {
    console.error('verify-promo: error:', e instanceof Error ? e.message : String(e));
    return reply({ valid: false, message: 'Ошибка при проверке промокода' }, 500, cors);
  }
});

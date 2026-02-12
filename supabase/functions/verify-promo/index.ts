import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return new Response(
        JSON.stringify({ valid: false, message: 'Промокод не указан' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const trimmed = code.trim().toUpperCase();

    if (trimmed.length > 50) {
      return new Response(
        JSON.stringify({ valid: false, message: 'Промокод слишком длинный' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('promo_codes')
      .select('code, description, valid_until, is_active')
      .eq('code', trimmed)
      .maybeSingle();

    if (error) {
      console.error('DB error:', error);
      throw new Error('Ошибка проверки промокода');
    }

    if (!data) {
      return new Response(
        JSON.stringify({ valid: false, message: 'Промокод не найден' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (!data.is_active) {
      return new Response(
        JSON.stringify({ valid: false, message: 'Промокод больше не действует' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const now = new Date();
    const validUntil = new Date(data.valid_until);
    if (now > validUntil) {
      return new Response(
        JSON.stringify({ valid: false, message: 'Срок действия промокода истёк' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ valid: true, message: 'Промокод применён!', description: data.description }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', msg);
    return new Response(
      JSON.stringify({ valid: false, message: 'Ошибка при проверке промокода' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

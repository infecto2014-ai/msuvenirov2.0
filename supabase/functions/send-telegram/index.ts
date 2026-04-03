import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!BOT_TOKEN || !CHAT_ID) {
      throw new Error('Telegram credentials not configured');
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const comment = formData.get('comment') as string;
    const promo = formData.get('promo') as string;
    const fileCount = parseInt(formData.get('fileCount') as string || '0', 10);

    const promoLine = promo ? `\n🎟 Промокод: ${promo}` : '';
    const messageText = `📩 Новая заявка с сайта!

👤 Имя: ${name || 'Не указано'}
📞 Телефон: ${phone || 'Не указан'}
💬 Комментарий: ${comment || 'Нет комментария'}${promoLine}`;

    // Collect all files
    const files: File[] = [];
    for (let i = 0; i < fileCount; i++) {
      const file = formData.get(`file_${i}`) as File | null;
      if (file && file.size > 0) {
        files.push(file);
      }
    }

    let response;

    if (files.length === 0) {
      // Text only
      response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: messageText,
            parse_mode: 'HTML',
          }),
        }
      );
      const result = await response.json();
      if (!result.ok) {
        console.error('Telegram API error:', result);
        throw new Error(result.description || 'Failed to send message');
      }
    } else if (files.length === 1) {
      // Single file -> sendDocument with caption (no compression)
      const tgForm = new FormData();
      tgForm.append('chat_id', CHAT_ID);
      tgForm.append('caption', messageText);
      tgForm.append('document', files[0], files[0].name);

      response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
        { method: 'POST', body: tgForm }
      );
      const result = await response.json();
      if (!result.ok) {
        console.error('Telegram API error:', result);
        throw new Error(result.description || 'Failed to send file');
      }
    } else {
      // Multiple files: send text first, then each file as document
      response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: messageText,
            parse_mode: 'HTML',
          }),
        }
      );
      let result = await response.json();
      if (!result.ok) {
        console.error('Telegram API error:', result);
        throw new Error(result.description || 'Failed to send message');
      }

      // Send all files as documents (preserves original quality)
      for (const file of files) {
        const docForm = new FormData();
        docForm.append('chat_id', CHAT_ID);
        docForm.append('document', file, file.name);

        response = await fetch(
          `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
          { method: 'POST', body: docForm }
        );
        result = await response.json();
        if (!result.ok) {
          console.error('Telegram API error for document:', result);
          throw new Error(result.description || 'Failed to send document');
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

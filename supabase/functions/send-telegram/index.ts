import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
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
    const photoCount = parseInt(formData.get('photoCount') as string || '0', 10);

    // Build message text
    const messageText = `📩 Новая заявка с сайта!

👤 Имя: ${name || 'Не указано'}
📞 Телефон: ${phone || 'Не указан'}
💬 Комментарий: ${comment || 'Нет комментария'}`;

    // Collect all photos
    const photos: File[] = [];
    for (let i = 0; i < photoCount; i++) {
      const photo = formData.get(`photo_${i}`) as File | null;
      if (photo && photo.size > 0) {
        photos.push(photo);
      }
    }

    let response;

    if (photos.length === 0) {
      // Send text message only
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
    } else if (photos.length === 1) {
      // Send single photo with caption
      const telegramFormData = new FormData();
      telegramFormData.append('chat_id', CHAT_ID);
      telegramFormData.append('caption', messageText);
      telegramFormData.append('photo', photos[0]);

      response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
        {
          method: 'POST',
          body: telegramFormData,
        }
      );

      const result = await response.json();
      if (!result.ok) {
        console.error('Telegram API error:', result);
        throw new Error(result.description || 'Failed to send photo');
      }
    } else {
      // Send multiple photos using sendMediaGroup
      // First, send the text message
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

      // Then send photos in batches of 10 (Telegram limit for media groups)
      const batchSize = 10;
      for (let i = 0; i < photos.length; i += batchSize) {
        const batch = photos.slice(i, i + batchSize);
        
        const mediaGroupFormData = new FormData();
        mediaGroupFormData.append('chat_id', CHAT_ID);
        
        const media = batch.map((_, index) => ({
          type: 'photo',
          media: `attach://photo_${index}`,
        }));
        
        mediaGroupFormData.append('media', JSON.stringify(media));
        
        batch.forEach((photo, index) => {
          mediaGroupFormData.append(`photo_${index}`, photo);
        });

        response = await fetch(
          `https://api.telegram.org/bot${BOT_TOKEN}/sendMediaGroup`,
          {
            method: 'POST',
            body: mediaGroupFormData,
          }
        );

        result = await response.json();
        if (!result.ok) {
          console.error('Telegram API error for media group:', result);
          throw new Error(result.description || 'Failed to send photos');
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

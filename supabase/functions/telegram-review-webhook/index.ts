import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('OK', { status: 200 });
  }

  try {
    const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!BOT_TOKEN || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
      throw new Error('Missing environment variables');
    }

    const update = await req.json();
    const callbackQuery = update.callback_query;

    if (!callbackQuery) {
      return new Response('OK', { status: 200 });
    }

    const data = callbackQuery.data as string;
    const callbackQueryId = callbackQuery.id;
    const messageId = callbackQuery.message?.message_id;
    const chatId = callbackQuery.message?.chat?.id;

    const isApprove = data.startsWith('approve_');
    const isReject = data.startsWith('reject_');

    if (!isApprove && !isReject) {
      return new Response('OK', { status: 200 });
    }

    const reviewId = data.replace('approve_', '').replace('reject_', '');

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    let answerText: string;

    if (isApprove) {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: true })
        .eq('id', reviewId);

      if (error) throw error;
      answerText = '✅ Отзыв одобрен!';
    } else {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      answerText = '❌ Отзыв отклонён и удалён.';
    }

    // Answer callback query
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text: answerText }),
    });

    // Update message: append status and remove buttons
    if (chatId && messageId) {
      const originalText = callbackQuery.message?.text || '';
      const statusLine = isApprove ? '\n\n✅ ОДОБРЕНО' : '\n\n❌ ОТКЛОНЕНО';

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text: originalText + statusLine,
        }),
      });
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('OK', { status: 200 });
  }
});

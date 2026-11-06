// Minimal Telegram Bot API client (only what the chat needs). With dryRun it prints to the log instead of sending —
// for local testing without a bot token.
export class Telegram {
  /** @param {{ token?: string, chatId?: string, dryRun?: boolean, fetch?: typeof fetch, log?: (s: string) => void }} o */
  constructor(o) {
    this.token = o.token ?? '';
    this.chatId = o.chatId ?? '';
    this.dryRun = o.dryRun ?? !o.token;
    this.fetch = o.fetch ?? globalThis.fetch;
    this.log = o.log ?? ((s) => console.log(s));
    this.fakeId = 1000;
  }

  async call(method, body) {
    if (this.dryRun) {
      this.log(`[telegram:${method}] ${JSON.stringify(body)}`);
      return { message_id: ++this.fakeId };
    }
    const r = await this.fetch(`https://api.telegram.org/bot${this.token}/${method}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const j = await r.json().catch(() => ({}));
    if (!j.ok) throw new Error(`telegram ${method}: ${j.description ?? r.status}`);
    return j.result;
  }

  /** sends a plain-text message to the owner's chat; returns the Telegram message id */
  async send(text, replyTo) {
    const res = await this.call('sendMessage', {
      chat_id: this.chatId,
      text: text.slice(0, 4000),
      ...(replyTo ? { reply_parameters: { message_id: replyTo, allow_sending_without_reply: true } } : {}),
      link_preview_options: { is_disabled: true },
    });
    return res.message_id;
  }

  /** a quiet «👍» on the owner's reply instead of an extra message */
  async react(chatId, messageId, emoji = '👍') {
    try {
      await this.call('setMessageReaction', { chat_id: chatId, message_id: messageId, reaction: [{ type: 'emoji', emoji }] });
    } catch (e) {
      this.log(`reaction failed: ${e.message}`);
    }
  }

  async replyTo(chatId, messageId, text) {
    return this.call('sendMessage', { chat_id: chatId, text, reply_parameters: { message_id: messageId, allow_sending_without_reply: true } });
  }
}

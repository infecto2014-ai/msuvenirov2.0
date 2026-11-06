// Site chat (owner, 06.11.2026: «свой аналог Jivo с отправкой в Telegram»). Messages go to the chat service on the site's
// own server (server/chat, behind nginx at /api/), it forwards them to Telegram; the owner's replies come back here
// by long polling. On the test copy (GitHub Pages) there is no server — the widget shows a short notice instead.
// Opens from the round button (desktop), from the «Чат» button of the phone bar and from any [data-chat] element.
import { useEffect, useRef, useState } from 'preact/hooks';
import { formatPhone } from '@/lib/phone';
import { site } from '@/data/site';
import './ChatWidget.css';

type Msg = { id: number; from: 'visitor' | 'manager'; text: string; at: string; pending?: boolean; failed?: boolean };
type View = 'chat' | 'callback';

const API = '/api';
const K = { sid: 'msuv-chat-sid', msgs: 'msuv-chat-msgs', seen: 'msuv-chat-seen', contact: 'msuv-chat-contact' };
export const CHAT_OPEN_EVENT = 'chat:open';

const ls = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* private mode */
    }
  },
};
const newSid = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 24);
const sidOf = () => {
  let s = ls.get(K.sid);
  if (!s || !/^[a-z0-9]{16,40}$/.test(s)) {
    s = newSid();
    ls.set(K.sid, s);
  }
  return s;
};
const loadMsgs = (): Msg[] => {
  try {
    return (JSON.parse(ls.get(K.msgs) ?? '[]') as Msg[]).filter((m) => !m.pending);
  } catch {
    return [];
  }
};

/** working hours in Kaliningrad: 10:00–20:00 every day */
const isOnline = () => {
  const h = Number(new Intl.DateTimeFormat('ru-RU', { hour: 'numeric', hour12: false, timeZone: 'Europe/Kaliningrad' }).format(new Date()));
  return h >= 10 && h < 20;
};
const timeOf = (iso: string) => new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

const QUICK = ['Сколько это будет стоить?', 'За сколько дней сделаете?', 'Можно на моей вещи?'];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('chat');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [offline, setOffline] = useState(false); // no chat server (test copy)
  const [unread, setUnread] = useState(0);
  const [contact, setContact] = useState('');
  const [contactSaved, setContactSaved] = useState(false);
  const [cb, setCb] = useState({ phone: '', name: '', hp: '', state: 'idle' as 'idle' | 'sending' | 'done' | 'error', error: '' });
  const [online, setOnline] = useState(true);
  const sid = useRef('');
  const openRef = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const polling = useRef(false);

  const lastId = (list: Msg[]) => list.reduce((m, x) => (x.id > 0 && x.id > m ? x.id : m), 0);
  const save = (list: Msg[]) => ls.set(K.msgs, JSON.stringify(list.slice(-100)));

  // ---- start: restore the conversation, listen to «open chat» buttons
  useEffect(() => {
    sid.current = sidOf();
    const restored = loadMsgs();
    setMsgs(restored);
    setContactSaved(ls.get(K.contact) === '1');
    setOnline(isOnline());
    const seen = Number(ls.get(K.seen) ?? 0);
    setUnread(restored.filter((m) => m.from === 'manager' && m.id > seen).length);
    const show = (e?: Event) => {
      const detail = (e as CustomEvent<{ view?: View }> | undefined)?.detail;
      setView(detail?.view ?? 'chat');
      setOpen(true);
    };
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-chat]');
      if (!el) return;
      e.preventDefault();
      show(new CustomEvent(CHAT_OPEN_EVENT, { detail: { view: el.dataset.chat === 'callback' ? 'callback' : 'chat' } }));
    };
    window.addEventListener(CHAT_OPEN_EVENT, show);
    document.addEventListener('click', onClick);
    if (restored.length) poll();
    return () => {
      window.removeEventListener(CHAT_OPEN_EVENT, show);
      document.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    openRef.current = open;
    document.documentElement.classList.toggle('chat-open', open);
    if (open) {
      setUnread(0);
      ls.set(K.seen, String(lastId(msgs)));
      setOnline(isOnline());
      setTimeout(() => (view === 'chat' ? inputRef.current?.focus({ preventScroll: true }) : null), 60);
    }
  }, [open, view]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs, open, view]);

  // ---- new messages from the manager: long polling while the tab is visible
  const poll = async () => {
    if (polling.current) return;
    polling.current = true;
    let pause = 1000;
    while (polling.current) {
      if (document.hidden) {
        await new Promise((r) => document.addEventListener('visibilitychange', r, { once: true }));
        continue;
      }
      try {
        const after = lastId(loadMsgs());
        const r = await fetch(`${API}/chat/messages?sid=${sid.current}&after=${after}`, { cache: 'no-store' });
        if (!r.ok) throw new Error(String(r.status));
        const j = (await r.json()) as { messages: Msg[] };
        pause = 1000;
        if (j.messages?.length) {
          setMsgs((cur) => {
            const known = new Set(cur.map((m) => m.id));
            const next = [...cur.filter((m) => !(m.pending && j.messages.some((x) => x.text === m.text))), ...j.messages.filter((m) => !known.has(m.id))];
            save(next);
            return next;
          });
          const fromManager = j.messages.filter((m) => m.from === 'manager').length;
          if (openRef.current) ls.set(K.seen, String(lastId(j.messages)));
          else if (fromManager) setUnread((u) => u + fromManager);
        }
      } catch {
        await new Promise((r) => setTimeout(r, pause));
        pause = Math.min(pause * 2, 30000);
      }
    }
  };
  useEffect(() => () => void (polling.current = false), []);

  const send = async (body: string) => {
    const t = body.trim();
    if (!t) return;
    setText('');
    const temp: Msg = { id: -Date.now(), from: 'visitor', text: t, at: new Date().toISOString(), pending: true };
    setMsgs((cur) => [...cur, temp]);
    try {
      const r = await fetch(`${API}/chat/message`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sid: sid.current, text: t, page: location.pathname }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error ?? 'send');
      setMsgs((cur) => {
        const next = cur.map((m) => (m.id === temp.id ? (j.message as Msg) : m));
        save(next);
        return next;
      });
      setOffline(false);
      poll();
    } catch {
      setMsgs((cur) => cur.map((m) => (m.id === temp.id ? { ...m, pending: false, failed: true } : m)));
      setOffline(true);
    }
  };

  const saveContact = async (e: Event) => {
    e.preventDefault();
    const v = contact.trim();
    if (v.length < 3) return;
    try {
      const r = await fetch(`${API}/chat/contact`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sid: sid.current, contact: v }) });
      if (!r.ok) throw new Error();
      setContactSaved(true);
      ls.set(K.contact, '1');
    } catch {
      setOffline(true);
    }
  };

  const sendCallback = async (e: Event) => {
    e.preventDefault();
    const digits = cb.phone.replace(/\D/g, '');
    if (digits.length < 11) return setCb({ ...cb, state: 'error', error: 'Проверьте номер телефона.' });
    setCb({ ...cb, state: 'sending', error: '' });
    try {
      const r = await fetch(`${API}/callback`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ phone: cb.phone, name: cb.name, hp: cb.hp, page: location.pathname }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error ?? 'Не получилось отправить — позвоните нам.');
      setCb({ ...cb, state: 'done', error: '' });
    } catch (err) {
      setOffline(true);
      setCb({ ...cb, state: 'error', error: err instanceof Error && err.message !== 'Failed to fetch' ? err.message : 'Не получилось отправить — позвоните нам.' });
    }
  };

  const started = msgs.some((m) => m.from === 'visitor' && !m.failed);
  const status = online ? 'На связи · отвечаем в течение нескольких минут' : 'Сейчас не на связи — ответим с 10:00';

  return (
    <>
      <button type="button" class={`chatw-launch${open ? ' is-hidden' : ''}`} onClick={() => setOpen(true)} aria-label="Открыть чат с мастерской">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M4 5h16v11H9l-4 4v-4H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
          <path d="M8 9.5h8M8 12.5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>Чат</span>
        <i class={online ? 'is-on' : ''} aria-hidden="true"></i>
        {unread > 0 && <b class="chatw-badge mono">{unread}</b>}
      </button>

      {open && (
        <section class="chatw" role="dialog" aria-label="Чат с мастерской">
          <header class="chatw-head">
            <div>
              <p class="chatw-title">Мастерская сувениров</p>
              <p class="chatw-status">
                <i class={online ? 'is-on' : ''} aria-hidden="true"></i> {status}
              </p>
            </div>
            <button type="button" class="chatw-close" onClick={() => setOpen(false)} aria-label="Закрыть чат">
              ×
            </button>
          </header>

          {view === 'chat' ? (
            <>
              <div class="chatw-list" ref={listRef} aria-live="polite">
                <div class="chatw-msg is-manager">
                  <p>Здравствуйте! Это мастерская сувениров в ТЦ «Экватор». Напишите вопрос — ответим здесь же. Можно спросить про цену, сроки или макет.</p>
                </div>
                {!started && (
                  <div class="chatw-quick">
                    {QUICK.map((q) => (
                      <button type="button" onClick={() => send(q)}>
                        {q}
                      </button>
                    ))}
                    <button type="button" onClick={() => setView('callback')}>
                      📞 Перезвоните мне
                    </button>
                  </div>
                )}
                {msgs.map((m) => (
                  <div class={`chatw-msg is-${m.from}${m.pending ? ' is-pending' : ''}${m.failed ? ' is-failed' : ''}`}>
                    <p>{m.text}</p>
                    <small>{m.failed ? 'не отправлено' : m.pending ? 'отправляем…' : timeOf(m.at)}</small>
                  </div>
                ))}
                {offline && (
                  <div class="chatw-note">
                    Чат заработает после запуска нового сайта. Пока напишите нам в{' '}
                    <a href={site.social.telegram} target="_blank" rel="noopener">
                      Telegram
                    </a>{' '}
                    или позвоните: <a href={site.phoneHref}>{site.phone}</a>.
                  </div>
                )}
                {started && !contactSaved && !offline && (
                  <form class="chatw-contact" onSubmit={saveContact}>
                    <label for="chatw-contact">Оставьте телефон или Telegram — ответим, даже если вы закроете сайт</label>
                    <div>
                      <input id="chatw-contact" class="input" value={contact} onInput={(e) => setContact((e.target as HTMLInputElement).value)} placeholder="+7… или @ник" />
                      <button type="submit" class="btn btn-sm">
                        Сохранить
                      </button>
                    </div>
                  </form>
                )}
                {contactSaved && <p class="chatw-saved">✓ Контакт сохранён — ответим, даже если вы уйдёте с сайта.</p>}
              </div>
              <form
                class="chatw-input"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(text);
                }}
              >
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={text}
                  maxLength={2000}
                  placeholder="Напишите сообщение…"
                  aria-label="Сообщение"
                  onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send(text);
                    }
                  }}
                />
                <button type="submit" class="chatw-send" aria-label="Отправить" disabled={!text.trim()}>
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path d="M4 12l16-8-6 16-2.5-6.5z" fill="currentColor" />
                  </svg>
                </button>
              </form>
              <p class="chatw-foot">
                <button type="button" onClick={() => setView('callback')}>
                  Перезвоните мне
                </button>
                <span>·</span>
                <button type="button" data-order onClick={() => setOpen(false)}>
                  Отправить макет
                </button>
              </p>
            </>
          ) : (
            <div class="chatw-cb">
              {cb.state === 'done' ? (
                <div class="chatw-cb-done">
                  <p class="chatw-cb-big">✓ Заявка отправлена</p>
                  <p>{online ? 'Перезвоним в ближайшее время.' : 'Перезвоним, когда откроемся — с 10:00.'}</p>
                  <button type="button" class="btn btn-sm" onClick={() => setView('chat')}>
                    Вернуться в чат
                  </button>
                </div>
              ) : (
                <form onSubmit={sendCallback}>
                  <p class="chatw-cb-big">Перезвоним вам</p>
                  <p>Оставьте номер — перезвоним{online ? ' в течение нескольких минут' : ' с 10:00'} и всё посчитаем.</p>
                  <label>
                    <span>Телефон</span>
                    <input class="input" type="tel" inputMode="tel" autoComplete="tel" value={cb.phone} placeholder="+7 (___) ___-__-__" onInput={(e) => setCb({ ...cb, phone: formatPhone((e.target as HTMLInputElement).value), state: 'idle', error: '' })} />
                  </label>
                  <label>
                    <span>Как к вам обращаться (необязательно)</span>
                    <input class="input" value={cb.name} autoComplete="name" onInput={(e) => setCb({ ...cb, name: (e.target as HTMLInputElement).value })} />
                  </label>
                  <input class="chatw-hp" tabIndex={-1} autoComplete="off" value={cb.hp} onInput={(e) => setCb({ ...cb, hp: (e.target as HTMLInputElement).value })} aria-hidden="true" />
                  {cb.error && <p class="chatw-err">{cb.error}</p>}
                  <button type="submit" class="btn btn-magenta btn-block" disabled={cb.state === 'sending'}>
                    {cb.state === 'sending' ? 'Отправляем…' : 'Перезвоните мне'}
                  </button>
                  <p class="chatw-legal">
                    Нажимая кнопку, вы соглашаетесь с <a href="/privacy-policy">политикой конфиденциальности</a>.
                  </p>
                  <button type="button" class="chatw-back" onClick={() => setView('chat')}>
                    ← Назад в чат
                  </button>
                </form>
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
}

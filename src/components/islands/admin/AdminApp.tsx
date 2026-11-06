// Chat panel /admin — an installable app for the owner's PC and phone (owner, 06.11.2026: own chat, no Telegram).
// Chats with visitors, replies with files, quick replies, «Перезвоните мне» calls with statuses, the «На связи»
// switch, Web Push notifications. Live updates come over server-sent events (/api/admin/events).
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { api, ApiError, type Callback, type Chat, type ChatSummary, type Msg, type Status } from './api';
import './AdminApp.css';

type Tab = 'chats' | 'calls' | 'settings';
const SW_URL = '/admin-sw.js';

const fmtTime = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  return d.toDateString() === today.toDateString()
    ? d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};
const fmtSize = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} МБ` : `${Math.max(1, Math.round(n / 1024))} КБ`);
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
const standalone = () => matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

/** a short «ding» without audio files */
const ding = () => {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.setValueAtTime(1320, ctx.currentTime + 0.09);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.36);
  } catch {
    /* no audio */
  }
};

const fromHash = (): { tab: Tab; sid: string } => {
  const h = location.hash.slice(1);
  if (h.startsWith('chat-')) return { tab: 'chats', sid: h.slice(5) };
  if (h === 'calls' || h === 'settings') return { tab: h, sid: '' };
  return { tab: 'chats', sid: '' };
};

export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [serverDown, setServerDown] = useState(false);
  const [tab, setTab] = useState<Tab>('chats');
  const [sid, setSid] = useState('');
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [newCalls, setNewCalls] = useState(0);
  const [chat, setChat] = useState<Chat | null>(null);
  const [calls, setCalls] = useState<Callback[]>([]);
  const [status, setStatus] = useState<Status>('auto');
  const [online, setOnline] = useState(true);
  const [templates, setTemplates] = useState<string[]>([]);
  const [filter, setFilter] = useState('');
  const sidRef = useRef('');

  // ---- routing by hash (notifications open /admin#chat-<sid> or #calls)
  useEffect(() => {
    const apply = () => {
      const r = fromHash();
      setTab(r.tab);
      setSid(r.sid);
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);
  const go = (h: string) => {
    if (location.hash !== `#${h}`) location.hash = h;
  };
  useEffect(() => {
    sidRef.current = sid;
  }, [sid]);

  // ---- session check
  useEffect(() => {
    api
      .me()
      .then((m) => {
        setAuthed(true);
        setStatus(m.settings.status);
        setOnline(m.online);
      })
      .catch((e: ApiError) => {
        setServerDown(e.status === 0 || e.status === 404 || e.status >= 500);
        setAuthed(false);
      });
  }, []);

  const loadChats = async () => {
    const r = await api.chats();
    setChats(r.chats);
    setNewCalls(r.calls);
    const unread = r.chats.reduce((s, c) => s + c.unread, 0) + r.calls;
    const nav = navigator as Navigator & { setAppBadge?: (n: number) => Promise<void>; clearAppBadge?: () => Promise<void> };
    if (unread) nav.setAppBadge?.(unread).catch(() => {});
    else nav.clearAppBadge?.().catch(() => {});
    document.title = unread ? `(${unread}) Чат — Мастерская сувениров` : 'Чат — Мастерская сувениров';
  };
  const loadChat = async (id: string) => {
    if (!id) return setChat(null);
    try {
      const r = await api.chat(id);
      if (sidRef.current !== id) return;
      setChat(r.chat);
      const last = r.chat.messages.length;
      if (last > r.chat.readUpTo && document.visibilityState === 'visible') {
        await api.read(id, last);
        loadChats();
      }
    } catch {
      setChat(null);
    }
  };
  const loadCalls = async () => setCalls((await api.callbacks()).callbacks);

  // ---- data + live events once logged in
  useEffect(() => {
    if (!authed) return;
    loadChats();
    loadCalls();
    api.templates().then((r) => setTemplates(r.list));
    navigator.serviceWorker?.register(SW_URL, { scope: '/admin' }).catch(() => {});
    let es: EventSource | null = null;
    const connect = () => {
      es = new EventSource('/api/admin/events');
      es.onmessage = (ev) => {
        const e = JSON.parse(ev.data) as { type: string; sid?: string; from?: string };
        if (e.type === 'message' || e.type === 'contact' || e.type === 'read' || e.type === 'seen' || e.type === 'typing') loadChats();
        if (e.type === 'message' && e.from === 'visitor' && (document.hidden || e.sid !== sidRef.current)) ding();
        if (e.sid && e.sid === sidRef.current && (e.type === 'message' || e.type === 'contact')) loadChat(e.sid);
        if (e.type === 'callback' || e.type === 'callback-status') {
          loadCalls();
          loadChats();
          if (e.type === 'callback') ding();
        }
        if (e.type === 'settings') api.me().then((m) => (setStatus(m.settings.status), setOnline(m.online)));
      };
      es.onerror = () => {
        // the browser reconnects by itself; after a long sleep (phone) reload the data
        if (es?.readyState === EventSource.CLOSED) setTimeout(connect, 3000);
      };
    };
    connect();
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        loadChats();
        loadCalls();
        if (sidRef.current) loadChat(sidRef.current);
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    const typingTick = setInterval(() => setChats((c) => (c.some((x) => x.typing) ? [...c] : c)), 4000);
    return () => {
      es?.close();
      document.removeEventListener('visibilitychange', onVisible);
      clearInterval(typingTick);
    };
  }, [authed]);

  useEffect(() => {
    if (authed) loadChat(sid);
  }, [sid, authed]);

  if (authed === null) return <div class="adm-splash">Загрузка…</div>;
  if (!authed) return <Login serverDown={serverDown} onDone={() => location.reload()} />;

  const unreadTotal = chats.reduce((s, c) => s + c.unread, 0);
  const shown = filter.trim()
    ? chats.filter((c) => `${c.no} ${c.contact} ${c.page} ${c.last.text}`.toLowerCase().includes(filter.trim().toLowerCase()))
    : chats;

  return (
    <div class={`adm${sid && tab === 'chats' ? ' has-chat' : ''}`}>
      <header class="adm-top">
        <div class="adm-brand">
          <b>Чат</b>
          <span>Мастерская сувениров</span>
        </div>
        <StatusSwitch
          status={status}
          online={online}
          onChange={async (s) => {
            const r = await api.setStatus(s);
            setStatus(r.settings.status);
            setOnline(r.online);
          }}
        />
      </header>

      <nav class="adm-tabs" aria-label="Разделы">
        <button type="button" class={tab === 'chats' ? 'is-on' : ''} onClick={() => go('')}>
          Чаты {unreadTotal > 0 && <i>{unreadTotal}</i>}
        </button>
        <button type="button" class={tab === 'calls' ? 'is-on' : ''} onClick={() => go('calls')}>
          Звонки {newCalls > 0 && <i>{newCalls}</i>}
        </button>
        <button type="button" class={tab === 'settings' ? 'is-on' : ''} onClick={() => go('settings')}>
          Настройки
        </button>
      </nav>

      {tab === 'chats' && (
        <>
          <aside class="adm-list">
            <NotifyBanner />
            <input class="adm-search" type="search" placeholder="Поиск: номер чата, телефон, текст…" value={filter} onInput={(e) => setFilter((e.target as HTMLInputElement).value)} />
            {!shown.length && <p class="adm-empty">{chats.length ? 'Ничего не найдено.' : 'Пока никто не писал. Новые сообщения появятся здесь сами.'}</p>}
            {shown.map((c) => (
              <button type="button" class={`adm-item${c.id === sid ? ' is-active' : ''}${c.unread ? ' is-unread' : ''}`} onClick={() => go(`chat-${c.id}`)}>
                <span class="adm-item-top">
                  <b>
                    {c.online && <i class="adm-dot" title="Сейчас на сайте"></i>}Чат №{c.no}
                    {c.contact && <small> · {c.contact}</small>}
                  </b>
                  <time>{fmtTime(c.lastAt)}</time>
                </span>
                <span class="adm-item-text">
                  {c.typing ? <em>печатает…</em> : `${c.last.from === 'manager' ? 'Вы: ' : ''}${c.last.text}`}
                  {c.unread > 0 && <i class="adm-badge">{c.unread}</i>}
                </span>
                <span class="adm-item-page">{c.page}</span>
              </button>
            ))}
          </aside>
          <main class="adm-main">
            {chat ? (
              <ChatView chat={chat} templates={templates} typing={!!chats.find((c) => c.id === chat.id)?.typing} onBack={() => go('')} onChanged={() => (loadChat(chat.id), loadChats())} />
            ) : (
              <div class="adm-placeholder">Выберите чат слева</div>
            )}
          </main>
        </>
      )}

      {tab === 'calls' && (
        <main class="adm-main adm-calls">
          <h2>Перезвоните мне</h2>
          {!calls.length && <p class="adm-empty">Заявок на звонок пока нет.</p>}
          {calls.map((c) => (
            <div class={`adm-call is-${c.status}`}>
              <div>
                <a class="adm-call-phone" href={`tel:${c.phone.replace(/[^\d+]/g, '')}`}>
                  📞 {c.phone}
                </a>
                <p>
                  {c.name && <b>{c.name} · </b>}
                  {fmtTime(c.at)} · {c.page}
                </p>
              </div>
              <div class="adm-call-actions">
                {(['new', 'called', 'done'] as const).map((s) => (
                  <button type="button" class={c.status === s ? 'is-on' : ''} onClick={() => api.setCallback(c.id, s).then(loadCalls)}>
                    {s === 'new' ? 'Новая' : s === 'called' ? 'Позвонил' : 'Готово'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </main>
      )}

      {tab === 'settings' && <Settings templates={templates} onTemplates={setTemplates} />}
    </div>
  );
}

// ------------------------------------------------------------------ login
function Login({ serverDown, onDone }: { serverDown: boolean; onDone: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(serverDown ? 'Сервер чата недоступен. На тестовой копии сайта панель не работает — она заработает на вашем сервере.' : '');
  const [busy, setBusy] = useState(false);
  return (
    <form
      class="adm-login"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError('');
        try {
          await api.login(password);
          onDone();
        } catch (err) {
          setError(err instanceof ApiError ? err.message : 'Не получилось войти.');
        } finally {
          setBusy(false);
        }
      }}
    >
      <p class="adm-login-title">Чат — Мастерская сувениров</p>
      <label>
        <span>Пароль</span>
        <input class="input" type="password" autoComplete="current-password" value={password} onInput={(e) => setPassword((e.target as HTMLInputElement).value)} autofocus />
      </label>
      {error && <p class="adm-err">{error}</p>}
      <button type="submit" class="btn btn-magenta btn-block" disabled={busy || !password}>
        {busy ? 'Входим…' : 'Войти'}
      </button>
    </form>
  );
}

// ------------------------------------------------------------------ «На связи» switch
function StatusSwitch({ status, online, onChange }: { status: Status; online: boolean; onChange: (s: Status) => void }) {
  return (
    <div class="adm-status" role="group" aria-label="Статус для посетителей">
      <span class={`adm-status-now${online ? ' is-on' : ''}`}>
        <i></i>
        {online ? 'На связи' : 'Не на связи'}
      </span>
      <select value={status} onChange={(e) => onChange((e.target as HTMLSelectElement).value as Status)} aria-label="Режим">
        <option value="auto">Авто (10:00–20:00)</option>
        <option value="online">Всегда на связи</option>
        <option value="offline">Не на связи</option>
      </select>
    </div>
  );
}

// ------------------------------------------------------------------ one conversation
function ChatView({ chat, templates, typing, onBack, onChanged }: { chat: Chat; templates: string[]; typing: boolean; onBack: () => void; onChanged: () => void }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showTpl, setShowTpl] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [chat.messages.length, chat.id]);
  useEffect(() => setText(''), [chat.id]);

  const send = async () => {
    const t = text.trim();
    if (!t || busy) return;
    setBusy(true);
    setError('');
    try {
      await api.reply(chat.id, t);
      setText('');
      onChanged();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Не отправилось.');
    } finally {
      setBusy(false);
    }
  };
  const sendFile = async (f: File) => {
    setBusy(true);
    setError('');
    try {
      await api.sendFile(chat.id, f);
      onChanged();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Файл не отправился.');
    } finally {
      setBusy(false);
    }
  };

  const page = chat.lastPage ?? chat.page ?? '/';
  return (
    <section class="adm-chat">
      <header class="adm-chat-head">
        <button type="button" class="adm-back" onClick={onBack} aria-label="Назад к списку">
          ←
        </button>
        <div>
          <b>
            {chat.online && <i class="adm-dot"></i>}Чат №{chat.no}
          </b>
          <p>
            {chat.contact ? (
              <a href={/^[+\d][\d\s()-]{6,}$/.test(chat.contact) ? `tel:${chat.contact.replace(/[^\d+]/g, '')}` : `https://t.me/${chat.contact.replace(/^@/, '')}`}>{chat.contact}</a>
            ) : (
              'контакт не оставлен'
            )}
            {' · '}
            <a href={page} target="_blank" rel="noopener">
              {page}
            </a>
            {chat.online ? ' · на сайте' : ''}
          </p>
        </div>
      </header>
      <div class="adm-msgs" ref={listRef}>
        {chat.messages.map((m) => (
          <Bubble sid={chat.id} m={m} />
        ))}
        {typing && <p class="adm-typing">Посетитель печатает…</p>}
      </div>
      {error && <p class="adm-err adm-err-bar">{error}</p>}
      {showTpl && (
        <div class="adm-tpl">
          {templates.map((t) => (
            <button
              type="button"
              onClick={() => {
                setText((cur) => (cur ? `${cur} ${t}` : t));
                setShowTpl(false);
                taRef.current?.focus();
              }}
            >
              {t}
            </button>
          ))}
          {!templates.length && <p>Готовых ответов нет — добавьте в «Настройках».</p>}
        </div>
      )}
      <form
        class="adm-input"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <button type="button" class="adm-icon" onClick={() => setShowTpl(!showTpl)} aria-label="Готовые ответы" title="Готовые ответы">
          ⚡
        </button>
        <button type="button" class="adm-icon" onClick={() => fileRef.current?.click()} aria-label="Отправить файл" title="Отправить файл" disabled={busy}>
          📎
        </button>
        <input
          ref={fileRef}
          type="file"
          hidden
          onChange={(e) => {
            const f = (e.target as HTMLInputElement).files?.[0];
            if (f) sendFile(f);
            (e.target as HTMLInputElement).value = '';
          }}
        />
        <textarea
          ref={taRef}
          rows={1}
          value={text}
          placeholder="Ответ посетителю…"
          onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && matchMedia('(min-width: 761px)').matches) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button type="submit" class="adm-send" disabled={busy || !text.trim()} aria-label="Отправить">
          ➤
        </button>
      </form>
    </section>
  );
}

function Bubble({ sid, m }: { sid: string; m: Msg }) {
  const url = useMemo(() => api.fileUrl(sid, m.id), [sid, m.id]);
  const image = m.file && /^image\/(png|jpeg|webp|gif)$/.test(m.file.type);
  return (
    <div class={`adm-bubble is-${m.from}`}>
      {m.file &&
        (image ? (
          <a href={url} target="_blank" rel="noopener">
            <img src={url} alt={m.file.name} loading="lazy" />
          </a>
        ) : (
          <a class="adm-file" href={url} download={m.file.name}>
            📄 {m.file.name} <small>{fmtSize(m.file.size)}</small>
          </a>
        ))}
      {m.text && <p>{m.text}</p>}
      <time>{fmtTime(m.at)}</time>
    </div>
  );
}

// ------------------------------------------------------------------ notifications on this device
function NotifyBanner() {
  const [state, setState] = useState<'unknown' | 'on' | 'off' | 'denied' | 'ios-install' | 'unsupported' | 'busy'>('unknown');
  const [install, setInstall] = useState<(Event & { prompt: () => Promise<void> }) | null>(null);
  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstall(e as Event & { prompt: () => Promise<void> });
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    (async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return setState(isIos() && !standalone() ? 'ios-install' : 'unsupported');
      if (Notification.permission === 'denied') return setState('denied');
      const reg = await navigator.serviceWorker.getRegistration('/admin');
      const sub = await reg?.pushManager.getSubscription();
      setState(sub && Notification.permission === 'granted' ? 'on' : 'off');
    })().catch(() => setState('off'));
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const enable = async () => {
    setState('busy');
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return setState(perm === 'denied' ? 'denied' : 'off');
      const reg = (await navigator.serviceWorker.getRegistration('/admin')) ?? (await navigator.serviceWorker.register(SW_URL, { scope: '/admin' }));
      await navigator.serviceWorker.ready;
      const { key } = await api.pushKey();
      if (!key) throw new Error('no key');
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
      const device = /android/i.test(navigator.userAgent) ? 'Android' : isIos() ? 'iPhone' : /windows/i.test(navigator.userAgent) ? 'Windows' : 'Компьютер';
      await api.subscribe(sub.toJSON(), device);
      setState('on');
    } catch {
      setState('off');
    }
  };

  return (
    <div class="adm-notify">
      {install && !standalone() && (
        <button type="button" class="btn btn-sm" onClick={() => install.prompt().then(() => setInstall(null))}>
          ⬇ Установить приложение
        </button>
      )}
      {state === 'off' && (
        <button type="button" class="btn btn-sm btn-magenta" onClick={enable}>
          🔔 Включить уведомления на этом устройстве
        </button>
      )}
      {state === 'busy' && <p>Включаем…</p>}
      {state === 'on' && <p class="adm-ok">🔔 Уведомления на этом устройстве включены</p>}
      {state === 'denied' && <p class="adm-err">Уведомления запрещены в настройках браузера — разрешите их для этого сайта.</p>}
      {state === 'ios-install' && <p>На iPhone: «Поделиться» → «На экран „Домой“», откройте чат с экрана «Домой» и включите уведомления.</p>}
      {state === 'unsupported' && <p class="adm-err">Этот браузер не умеет уведомления — откройте панель в Chrome, Edge или Safari.</p>}
    </div>
  );
}

// ------------------------------------------------------------------ settings
function Settings({ templates, onTemplates }: { templates: string[]; onTemplates: (l: string[]) => void }) {
  const [draft, setDraft] = useState(templates.join('\n'));
  const [saved, setSaved] = useState('');
  useEffect(() => setDraft(templates.join('\n')), [templates]);
  return (
    <main class="adm-main adm-settings">
      <h2>Уведомления</h2>
      <NotifyBanner />
      <button type="button" class="btn btn-sm btn-ghost" onClick={() => api.pushTest().then((r) => setSaved(r.sent ? `Отправили тестовое уведомление на ${r.sent} устр.` : 'Нет устройств с включёнными уведомлениями.'))}>
        Проверить уведомление
      </button>

      <h2>Готовые ответы</h2>
      <p>Каждая строка — отдельный ответ. В чате они открываются кнопкой ⚡.</p>
      <textarea class="input adm-tpl-edit" rows={8} value={draft} onInput={(e) => setDraft((e.target as HTMLTextAreaElement).value)} />
      <button
        type="button"
        class="btn btn-sm btn-magenta"
        onClick={async () => {
          const r = await api.setTemplates(draft.split('\n').map((x) => x.trim()).filter(Boolean));
          onTemplates(r.list);
          setSaved('Готовые ответы сохранены.');
        }}
      >
        Сохранить
      </button>
      {saved && <p class="adm-ok">{saved}</p>}

      <h2>Выход</h2>
      <button type="button" class="btn btn-sm btn-ghost" onClick={() => api.logout().finally(() => location.reload())}>
        Выйти на этом устройстве
      </button>
    </main>
  );
}

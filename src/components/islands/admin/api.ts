// Calls of the chat panel to the chat service (server/chat/app.mjs). Same origin, cookie session;
// every POST carries «x-msuv: 1» (the server refuses panel POSTs without it — protection from other sites).
export type Msg = { id: number; from: 'visitor' | 'manager'; text: string; at: string; file?: { name: string; type: string; size: number } };
export type ChatSummary = {
  id: string;
  no: number;
  contact: string;
  page: string;
  createdAt: string;
  lastAt: string;
  last: { from: 'visitor' | 'manager'; text: string };
  unread: number;
  count: number;
  online: boolean;
  typing: boolean;
};
export type Chat = { id: string; no: number; contact?: string; page?: string; lastPage?: string; createdAt: string; readUpTo: number; messages: Msg[]; online: boolean };
export type Callback = { id: number; phone: string; name: string; page: string; at: string; status: 'new' | 'called' | 'done' };
export type Status = 'auto' | 'online' | 'offline';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

const call = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  let r: Response;
  try {
    r = await fetch(`/api/admin/${path}`, { credentials: 'same-origin', cache: 'no-store', ...init });
  } catch {
    throw new ApiError('Нет связи с сервером.', 0);
  }
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.ok) throw new ApiError(j.error ?? (r.status === 404 ? 'Сервер чата недоступен.' : 'Ошибка сервера.'), r.status);
  return j as T;
};
const post = <T>(path: string, body: unknown) =>
  call<T>(path, { method: 'POST', headers: { 'content-type': 'application/json', 'x-msuv': '1' }, body: JSON.stringify(body) });

export const api = {
  login: (password: string) => post<{ ok: true }>('login', { password }),
  logout: () => post<{ ok: true }>('logout', {}),
  me: () => call<{ online: boolean; settings: { status: Status } }>('me'),
  chats: () => call<{ chats: ChatSummary[]; calls: number }>('chats'),
  chat: (sid: string) => call<{ chat: Chat }>(`chats/${sid}`),
  reply: (sid: string, text: string) => post<{ message: Msg }>(`chats/${sid}/reply`, { text }),
  read: (sid: string, upTo: number) => post<{ ok: true }>(`chats/${sid}/read`, { upTo }),
  sendFile: (sid: string, file: File) =>
    call<{ message: Msg }>(`chats/${sid}/file?name=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      headers: { 'content-type': file.type || 'application/octet-stream', 'x-msuv': '1' },
      body: file,
    }),
  fileUrl: (sid: string, id: number) => `/api/admin/file?sid=${sid}&id=${id}`,
  callbacks: () => call<{ callbacks: Callback[] }>('callbacks'),
  setCallback: (id: number, status: Callback['status']) => post<{ ok: true }>(`callbacks/${id}`, { status }),
  setStatus: (status: Status) => post<{ online: boolean; settings: { status: Status } }>('settings', { status }),
  templates: () => call<{ list: string[] }>('templates'),
  setTemplates: (list: string[]) => post<{ list: string[] }>('templates', { list }),
  pushKey: () => call<{ key: string }>('push/key'),
  subscribe: (subscription: PushSubscriptionJSON, device: string) => post<{ ok: true }>('push/subscribe', { subscription, device }),
  pushTest: () => post<{ sent: number }>('push/test', {}),
};

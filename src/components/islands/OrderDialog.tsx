import { useEffect, useRef, useState } from 'preact/hooks';
import {
  ESTIMATE_EVENT,
  ORDER_OPEN_EVENT,
  clearEstimate,
  estimateTotal,
  getEstimate,
  removeFromEstimate,
  type EstimateItem,
} from '@/lib/estimate';
import { ACCEPT, MAX_FILES, phoneDigits, sendOrder, validateFiles, type ContactMethod } from '@/lib/order';
import { formatPhone } from '@/lib/phone';
import { reachGoal } from '@/lib/metrika';
import { rub } from '@/data/pricing';
import './OrderDialog.css';

const methods: { id: ContactMethod; label: string }[] = [
  { id: 'phone', label: 'Звонок' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'max', label: 'MAX' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'vk', label: 'ВКонтакте' },
];

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'done' } | { kind: 'error'; message: string };

export default function OrderDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState<EstimateItem[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState<ContactMethod>('phone');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [website, setWebsite] = useState('');
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [drag, setDrag] = useState(false);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    setItems(getEstimate());
    const onChange = (e: Event) => setItems([...(e as CustomEvent<EstimateItem[]>).detail]);
    const onOpen = () => {
      setItems(getEstimate());
      if (status.kind === 'done') setStatus({ kind: 'idle' });
      startedAt.current = Date.now();
      dialog.current?.showModal();
      reachGoal('order_open');
    };
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-order]');
      if (el) {
        e.preventDefault();
        // buttons like «Заказать» on a popular item pass what is ordered: data-order="Футболка с принтом А4, 1 шт"
        const what = el.dataset.order?.trim();
        if (what) setComment((c) => (c.includes(what) ? c : c ? `${c}\n${what}` : what));
        onOpen();
      }
    };
    window.addEventListener(ESTIMATE_EVENT, onChange);
    window.addEventListener(ORDER_OPEN_EVENT, onOpen);
    document.addEventListener('click', onClick);
    if (location.hash === '#zakaz') onOpen();
    return () => {
      window.removeEventListener(ESTIMATE_EVENT, onChange);
      window.removeEventListener(ORDER_OPEN_EVENT, onOpen);
      document.removeEventListener('click', onClick);
    };
  }, [status.kind]);

  const close = () => dialog.current?.close();

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = [...files, ...Array.from(list)].slice(0, MAX_FILES);
    const err = validateFiles(next);
    setFileError(err ?? '');
    if (!err) {
      setFiles(next);
      reachGoal('file_attached');
    }
  };

  const nameOk = name.trim().length >= 2;
  const phoneOk = phoneDigits(phone).length === 11;
  const total = estimateTotal(items);
  const hasFrom = items.some((i) => i.from);

  const submit = async (e: Event) => {
    e.preventDefault();
    setTouched(true);
    if (!nameOk || !phoneOk) {
      reachGoal('form_validation_error');
      return;
    }
    setStatus({ kind: 'sending' });
    reachGoal('form_submit_attempt');
    const res = await sendOrder({ name, phone, contactMethod: method, email, comment, items, files, website, startedAt: startedAt.current });
    if (res.ok) {
      setStatus({ kind: 'done' });
      reachGoal('form_submit_success', { total, items: items.length, files: files.length });
      clearEstimate();
      setFiles([]);
      setComment('');
    } else {
      setStatus({ kind: 'error', message: res.message });
      reachGoal('form_submit_error');
    }
  };

  return (
    <>
      {items.length > 0 && (
        <button type="button" class="estimate-pill" onClick={() => window.dispatchEvent(new CustomEvent(ORDER_OPEN_EVENT))}>
          <span class="estimate-pill-count">{items.length}</span>
          Смета · <b class="mono">{hasFrom ? 'от ' : ''}{rub(total)}</b>
        </button>
      )}

      <dialog
        ref={dialog}
        class="order"
        aria-labelledby="order-title"
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div class="order-box">
          <button type="button" class="order-close" aria-label="Закрыть" onClick={close}>
            ×
          </button>

          {status.kind === 'done' ? (
            <div class="order-done">
              <div class="order-done-mark" aria-hidden="true" />
              <h2 id="order-title">Заявка отправлена</h2>
              <p>Менеджер свяжется с вами в рабочее время — ежедневно с 10:00 до 20:00. Если срочно — позвоните: <a href="tel:+79521142350">+7 (952) 114-23-50</a>.</p>
              <button type="button" class="btn" onClick={close}>
                Хорошо
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <h2 id="order-title">{items.length ? 'Ваша смета' : 'Заявка на расчёт'}</h2>
              <p class="order-sub">
                {items.length
                  ? 'Проверьте позиции и оставьте контакты — уточним детали и подтвердим цену.'
                  : 'Опишите задачу и приложите макет — рассчитаем стоимость и подскажем лучший вариант.'}
              </p>

              {items.length > 0 && (
                <div class="order-items">
                  {items.map((i) => (
                    <div class="order-item">
                      <div class="order-item-text">
                        <b>{i.title}</b>
                        <span>
                          {i.details ? `${i.details} · ` : ''}
                          {i.qty.toLocaleString('ru-RU')} шт × {i.from ? 'от ' : ''}
                          {rub(i.unitPrice)}
                        </span>
                      </div>
                      <span class="order-item-sum mono">
                        {i.from ? 'от ' : ''}
                        {rub(i.total)}
                      </span>
                      <button type="button" class="order-item-del" aria-label={`Удалить: ${i.title}`} onClick={() => removeFromEstimate(i.id)}>
                        ×
                      </button>
                    </div>
                  ))}
                  <div class="order-items-total">
                    <span>Итого по смете</span>
                    <b class="mono">
                      {hasFrom ? 'от ' : ''}
                      {rub(total)}
                    </b>
                  </div>
                  <a class="order-more" href="/price" onClick={close}>
                    + Добавить ещё изделие
                  </a>
                </div>
              )}

              <div class="order-fields">
                <label class="field">
                  <span class="label">Имя *</span>
                  <input
                    class="input"
                    name="name"
                    autoComplete="name"
                    maxLength={80}
                    value={name}
                    aria-invalid={touched && !nameOk}
                    onInput={(e) => setName((e.target as HTMLInputElement).value)}
                  />
                  {touched && !nameOk && <span class="order-err">Как к вам обращаться?</span>}
                </label>
                <label class="field">
                  <span class="label">Телефон *</span>
                  <input
                    class="input"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    aria-invalid={touched && !phoneOk}
                    onInput={(e) => setPhone(formatPhone((e.target as HTMLInputElement).value))}
                  />
                  {touched && !phoneOk && <span class="order-err">Проверьте номер: нужно 11 цифр</span>}
                </label>
              </div>

              <div class="field">
                <span class="label" id="order-method">Как удобнее связаться?</span>
                <div class="calc-chips" role="radiogroup" aria-labelledby="order-method">
                  {methods.map((m) => (
                    <button type="button" class="chip" role="radio" aria-checked={method === m.id} onClick={() => setMethod(m.id)}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <label class="field">
                <span class="label">Комментарий</span>
                <textarea
                  class="input"
                  name="comment"
                  maxLength={2000}
                  placeholder="Что печатаем, к какой дате, размеры, цвета…"
                  value={comment}
                  onInput={(e) => setComment((e.target as HTMLTextAreaElement).value)}
                />
              </label>

              <label class="field">
                <span class="label">E-mail <span class="muted">(необязательно)</span></span>
                <input class="input" name="email" type="email" autoComplete="email" maxLength={120} value={email} onInput={(e) => setEmail((e.target as HTMLInputElement).value)} />
              </label>

              <div
                class={`order-drop${drag ? ' is-drag' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDrag(false);
                  addFiles(e.dataTransfer?.files ?? null);
                }}
              >
                <label class="order-drop-label">
                  <input type="file" multiple accept={ACCEPT} class="sr-only" onChange={(e) => addFiles((e.target as HTMLInputElement).files)} />
                  <b>Прикрепить макет</b> или перетащите файлы сюда
                  <small>PNG, JPG, PDF, AI, CDR, PSD, ZIP — до 10 файлов, до 20 МБ каждый</small>
                </label>
                {files.length > 0 && (
                  <ul class="order-files">
                    {files.map((f, idx) => (
                      <li>
                        <span>{f.name}</span>
                        <button type="button" aria-label={`Убрать файл ${f.name}`} onClick={() => setFiles(files.filter((_, j) => j !== idx))}>
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {fileError && <p class="order-err">{fileError}</p>}
              </div>

              {/* honeypot: hidden from people, bots fill it */}
              <label class="order-hp" aria-hidden="true">
                Сайт
                <input tabIndex={-1} autoComplete="off" value={website} onInput={(e) => setWebsite((e.target as HTMLInputElement).value)} />
              </label>

              {status.kind === 'error' && (
                <p class="order-fail" role="alert">
                  {status.message}
                </p>
              )}

              <button type="submit" class="btn btn-magenta btn-block" disabled={status.kind === 'sending'}>
                {status.kind === 'sending' ? 'Отправляем…' : items.length ? 'Отправить смету' : 'Отправить заявку'}
              </button>
              <p class="order-legal">
                Нажимая кнопку, вы соглашаетесь с <a href="/privacy-policy">политикой обработки персональных данных</a>. Частным лицам — предоплата 50%, организациям — оплата по счёту.
              </p>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}

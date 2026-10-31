// Client-side estimate ("смета"): several calculator lines sent as one order.
// Stored in localStorage; every change is broadcast with a window event.

export interface EstimateItem {
  id: string;
  title: string;
  details: string;
  qty: number;
  unitPrice: number;
  total: number;
  /** price is a lower bound */
  from?: boolean;
}

const KEY = 'msuvenirov:estimate:v1';
export const ESTIMATE_EVENT = 'estimate:change';
export const ORDER_OPEN_EVENT = 'order:open';

const read = (): EstimateItem[] => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 30) : [];
  } catch {
    return [];
  }
};

const write = (items: EstimateItem[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* private mode or storage full — the estimate still lives in memory for this page */
  }
  memory = items;
  window.dispatchEvent(new CustomEvent(ESTIMATE_EVENT, { detail: items }));
};

let memory: EstimateItem[] | null = null;

export const getEstimate = (): EstimateItem[] => {
  if (typeof window === 'undefined') return [];
  if (!memory) memory = read();
  return memory;
};

export const addToEstimate = (item: Omit<EstimateItem, 'id'>) => {
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  write([...getEstimate(), { ...item, id }].slice(-30));
};

export const removeFromEstimate = (id: string) => write(getEstimate().filter((i) => i.id !== id));

export const clearEstimate = () => write([]);

export const estimateTotal = (items: EstimateItem[]) => items.reduce((a, i) => a + i.total, 0);

/** Open the order dialog from anywhere: buttons with [data-order] or code. */
export const openOrder = (detail: { source?: string } = {}) =>
  window.dispatchEvent(new CustomEvent(ORDER_OPEN_EVENT, { detail }));

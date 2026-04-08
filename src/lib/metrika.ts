/** Yandex Metrika goal helper */
const METRIKA_ID = 108361089;

export function reachGoal(goal: string) {
  try {
    if (typeof window !== 'undefined' && typeof (window as any).ym === 'function') {
      (window as any).ym(METRIKA_ID, 'reachGoal', goal);
    }
  } catch {
    // silently ignore
  }
}

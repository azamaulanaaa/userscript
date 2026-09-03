/**
 * Fill form fields by input name from URLSearchParams.
 * Dispatches events so React/Vue/vanilla listeners pick up changes.
 * No auto-submit — user reviews before submitting.
 */

export type FillStrategy = "input" | "change";

function dispatchFill(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
  // Fire input + change so vanilla, React, Vue and jQuery .change() handlers all trigger
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
  // jQuery stores handlers separately — trigger if jQuery is present
  const jq = (window as unknown as Record<string, unknown>)["jQuery"] as
    | { (el: Element): { trigger(e: string): void } }
    | undefined;
  try { jq?.(el).trigger("change"); } catch {}
}

export function fillByName(
  name: string,
  value: string,
  opts: { root?: ParentNode } = {},
): boolean {
  const { root = document } = opts;
  const el = root.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    `[name="${CSS.escape(name)}"]`,
  );
  if (!el) return false;

  // Try React _valueTracker if present (otherwise plain assignment is fine)
  const tracker = (el as unknown as Record<string, { setValue(v: unknown): void }>)["_valueTracker"];
  const prev = (el as HTMLInputElement).value;
  el.value = value;
  if (tracker) tracker.setValue(prev);

  dispatchFill(el);
  return true;
}

export function prefillFromSearchParams(
  fieldNames: readonly string[],
  params: URLSearchParams = new URLSearchParams(window.location.search),
  opts: { root?: ParentNode } = {},
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const name of fieldNames) {
    const value = params.get(name);
    if (value !== null && value !== "") {
      result[name] = fillByName(name, value, opts);
    }
  }
  return result;
}

/**
 * Wait for form fields to appear then prefill.
 * Useful when form is rendered async.
 */
export async function prefillWhenReady(
  fieldNames: readonly string[],
  opts: { timeout?: number } = {},
): Promise<Record<string, boolean>> {
  const { timeout = 5000 } = opts;
  const params = new URLSearchParams(window.location.search);

  // Wait until at least one target field exists
  const selector = fieldNames.map((n) => `[name="${CSS.escape(n)}"]`).join(",");
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (document.querySelector(selector)) break;
    await new Promise((r) => setTimeout(r, 100));
  }

  return prefillFromSearchParams(fieldNames, params);
}

export interface ObserveOptions extends MutationObserverInit {
  timeout?: number;
}

/**
 * Observe the DOM and resolve when callback signals.
 * Cleanly handles timeout + disconnect lifecycle.
 */
export function observeElement<T, K extends HTMLElement = HTMLElement>(
  callback: (root: K, resolve: (result: T) => void) => void,
  root: K = document.body as unknown as K,
  timeout = 1_000,
  options: MutationObserverInit = {},
): Promise<T> {
  return new Promise((resolve, reject) => {
    let observer: MutationObserver | undefined;

    const timeoutId = setTimeout(() => {
      observer?.disconnect();
      reject(new Error(`Element not found within ${timeout}ms.`));
    }, timeout);

    const done = (result: T) => {
      clearTimeout(timeoutId);
      observer?.disconnect();
      resolve(result);
    };

    observer = new MutationObserver(() => callback(root, done));
    observer.observe(root as unknown as Element, options);
    callback(root, done);
  });
}

/**
 * Wait for an element matching selector to appear under root.
 */
export function waitElement<
  T extends HTMLElement = HTMLElement,
  K extends HTMLElement = HTMLElement,
>(
  selector: string,
  root: K = document.body as unknown as K,
  timeout = 1_000,
): Promise<T> {
  return observeElement<T, K>(
    (r, resolve) => {
      const el = (r as unknown as Element).querySelector<T>(selector);
      if (el) resolve(el);
    },
    root,
    timeout,
    { childList: true, subtree: true },
  );
}

/**
 * Create and submit a hidden POST form from URLSearchParams.
 * Useful for converting GET query params to POST (e.g. JOSS tracker).
 */
export function submitAsPostForm(
  targetUrl: string,
  params: URLSearchParams,
  target: HTMLElement = document.body,
): HTMLFormElement {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = targetUrl;
  form.style.display = "none";

  for (const [key, value] of params) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }

  target.appendChild(form);
  form.submit();
  return form;
}

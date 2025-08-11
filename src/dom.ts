/**
 * waits for a specific element to appear in the root
 *
 * @param selectors CSS selector for element to wait for relative to root
 * @param root container element that observered for changes
 * @param timeout the maximum time to wait in miliseconds
 * @returns a promise that resolve with the element when it is found
 */
export async function waitElement<
  T extends HTMLElement = HTMLElement,
  K extends HTMLElement = HTMLElement,
>(
  selectors: string,
  root: K = document.body,
  timeout: number = 1_000,
): Promise<T> {
  return await observeElement<T, K>(
    (root, resolve) => {
      const element = root.querySelector<T>(selectors);
      if (element) {
        resolve(element);
        return;
      }
    },
    root,
    timeout,
    {
      childList: true,
      subtree: true,
    },
  );
}

/**
 * observe an element
 *
 * @param callback function to do something given a state
 * @param root container element that observered for changes
 * @param timeout maximum time to wait in miliseconds
 * @param option observer option
 * @returns a promise that resolve with the element when it is found
 */
export function observeElement<T, K extends HTMLElement = HTMLElement>(
  callback: (root: K, resolve: (result: T) => void) => void,
  root: K = document.body,
  timeout: number = 1_000,
  option: MutationObserverInit = {},
): Promise<T> {
  return new Promise((resolve, reject) => {
    let observer: undefined | MutationObserver;

    const timeoutId = setTimeout(() => {
      observer?.disconnect();
      reject(
        new Error(`Element not found within ${timeout}ms.`),
      );
    }, timeout);

    const callback_resolve = (result: T) => {
      clearTimeout(timeoutId);
      observer?.disconnect();
      resolve(result);
    };

    observer = new MutationObserver(
      () => callback(root, callback_resolve),
    );
    observer.observe(root, option);

    callback(root, callback_resolve);
  });
}

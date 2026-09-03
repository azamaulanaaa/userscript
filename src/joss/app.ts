import { submitAsPostForm, waitElement } from "@/lib/dom";

const TRACKING_URL = "https://joss.jatimprov.go.id/index.php/home/tracking";
const SEARCH_URL = "https://joss.jatimprov.go.id/index.php/home/cari";
const LOG_TAB_SELECTOR = 'a[data-tab="tab2"]';

export function isTrackingPage(url = window.location.href): boolean {
  return url.startsWith(TRACKING_URL);
}

const LOG_FLAG = "joss:action=log";

function handleLogTab(params: URLSearchParams): void {
  const isLog = params.get("action") === "log" || sessionStorage.getItem(LOG_FLAG) === "1";
  if (!isLog) return;
  // persist across POST redirect (tracking → cari)
  sessionStorage.setItem(LOG_FLAG, "1");
  void waitElement<HTMLAnchorElement>(LOG_TAB_SELECTOR, document.body, 8000)
    .then((el) => {
      sessionStorage.removeItem(LOG_FLAG);
      el.click();
    })
    .catch(() => {});
}

export function run(): void {
  const params = new URLSearchParams(window.location.search);

  handleLogTab(params);

  if (!isTrackingPage()) return;
  if (params.size === 0) return;

  if (params.get("action") === "log") sessionStorage.setItem(LOG_FLAG, "1");

  submitAsPostForm(SEARCH_URL, params);
}

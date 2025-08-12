import { observeElement, waitElement } from "@/dom.ts";
import { Overlay, Root } from "@/ui/root.ts";
import { SLEEP_CLICK, TIMEOUT } from "@/ui/constant.ts";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function Topbar() {
  const root = await Root();

  const topbar = await waitElement(
    "div.notion-topbar",
    root,
    TIMEOUT,
  );

  return topbar;
}
export type MoreMenuItem = "Export" | string;

export async function MoreMenu(item: MoreMenuItem) {
  const topbar = await Topbar();

  const topbar_more_button = await waitElement<HTMLElement>(
    "div.notion-topbar-more-button",
    topbar,
    TIMEOUT,
  );
  topbar_more_button.click();

  const overlay = await Overlay();

  const menu_dialog = await waitElement(
    'div[role="dialog"]',
    overlay,
    TIMEOUT,
  );

  const export_button = await observeElement<HTMLElement>(
    (root, resolve) => {
      const options = root.querySelectorAll<HTMLElement>(
        'div[role="option"]',
      );
      const export_option = Array.from(options).find((e) =>
        e.innerText == item
      );
      if (export_option) {
        resolve(export_option);
      }
    },
    menu_dialog,
    TIMEOUT,
    {
      subtree: true,
      childList: true,
    },
  );
  await sleep(SLEEP_CLICK);
  export_button.click();
}

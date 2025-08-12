import { waitElement } from "@/dom.ts";

const TIMEOUT = 60_000;

export async function Root() {
  const root = await waitElement("div#notion-app", document.body, TIMEOUT);
  return root;
}

export async function Overlay() {
  const root = await Root();

  const overlay = await waitElement(
    "div.notion-overlay-container",
    root,
    TIMEOUT,
  );

  return overlay;
}

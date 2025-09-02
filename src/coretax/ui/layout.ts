import { TIMEOUT } from "@/coretax/ui/constant.ts";
import { waitElement } from "@/lib/dom.ts";

export async function Main() {
  const main = await waitElement(
    ".main-content",
    document.body,
    TIMEOUT,
  );

  return main;
}

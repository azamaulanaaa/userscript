import { waitElement } from "@/dom.ts";
import { TIMEOUT } from "@/ui/constant.ts";
import { Export } from "@/ui/export.ts";
import { MoreMenu, Topbar } from "@/ui/more_menu.ts";

async function PDFExport() {
  await MoreMenu("Export");
  await Export({
    export_format: "PDF",
    include_databases: "Current view",
    include_content: "No files or images",
    page_format: "A4",
    scale_percent: 80,
    execute: true,
  });
}

await (async () => {
  const topbar = await Topbar();

  const share_button = await waitElement(
    "div:has(> div > .notion-topbar-share-menu)",
    topbar,
    TIMEOUT,
  );

  const export_button = share_button.cloneNode(true);
  export_button.firstChild!.firstChild!.firstChild!.innerText! = "Export";
  export_button.firstChild!.addEventListener("click", PDFExport);
  share_button.parentNode?.insertBefore(
    export_button,
    share_button,
  );
})();

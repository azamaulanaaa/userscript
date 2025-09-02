import { waitElement } from "@/lib/dom.ts";
import { TIMEOUT } from "@/coretax/ui/constant.ts";
import { Main } from "@/coretax/ui/layout.ts";
import { TableData } from "@/coretax/ui/table.ts";

async function patch_for_my_document() {
  const main = await Main();

  const table_element = await waitElement<HTMLTableElement>(
    "table",
    main,
    TIMEOUT,
  );
  const table = new TableData(table_element);
  const header_nth = table.headers_text().findIndex((e) => e == "Aksi");
  const header_action = table
    .headers_action_element()[header_nth];

  const download_all_button_click_handler = () => {
    const buttons = table.cells_element().map((row) =>
      row[header_nth].querySelector("button")
    ).filter((button) => button != null);
    buttons.forEach((button) => button.click());
  };
  const download_all_button = document.createElement("button");
  download_all_button.id = "ActionDownloadButton";
  download_all_button.className =
    "ct-ovw-btn-mini-save mr-2 mt-1 ng-star-inserted";
  download_all_button.innerText = "Unduh";
  download_all_button.addEventListener(
    "click",
    download_all_button_click_handler,
  );

  header_action.appendChild(download_all_button);
}

async function patch_for_ebupot_21_issued() {
  console.log("patch ebupot 21 issued");

  const main = await Main();

  const table_element = await waitElement<HTMLTableElement>(
    "table",
    main,
    TIMEOUT,
  );
  const table = new TableData(table_element);

  const header_nth = 1;
  const header_action = table
    .headers_action_element()[header_nth];

  const download_all_button_click_handler = () => {
    const buttons = table.cells_element().map((row) =>
      row[header_nth].querySelector("button#DownloadButton")
    ).filter((button) => button != null);
    buttons.forEach((button) => button.click());
  };
  const download_all_button = document.createElement("button");
  download_all_button.id = "ActionDownloadButton";
  download_all_button.className =
    "ct-ovw-btn-mini-save mr-2 mt-1 ng-star-inserted";
  download_all_button.innerText = "Unduh";
  download_all_button.addEventListener(
    "click",
    download_all_button_click_handler,
  );

  header_action.appendChild(download_all_button);
}

await (async () => {
  switch (window.location.href) {
    case "https://coretaxdjp.pajak.go.id/registration-portal/id-ID/documents":
      await patch_for_my_document();
      break;
    case "https://coretaxdjp.pajak.go.id/withholding-slips-portal/id-ID/ebupotbp21/issued":
      await patch_for_ebupot_21_issued();
      break;
    default:
      console.error(window.location.href);
  }
})();

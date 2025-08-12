import { observeElement, waitElement } from "@/dom.ts";
import { setInput } from "@/react.ts";
import { Root } from "@/ui/root.ts";

const TIMEOUT = 60_000;
const SLEEP_CLICK = 100;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type BaseExportForm = {
  include_databases?: "Current view" | "Default View";
  include_content?: "Everything" | "No files or images";
  include_subpages?: boolean;
  create_folders_for_subpages?: boolean;
  execute?: boolean;
};
export type PDFExportForm = BaseExportForm & {
  export_format: "PDF";
  page_format?: "A4" | "A3" | "Letter" | "Legal" | "Tabloid";
  scale_percent?: number;
};
export type HTMLExportForm = BaseExportForm & {
  export_format: "HTML";
  export_comments?: boolean;
};
export type MarkdownCSVExportForm = BaseExportForm & {
  export_format: "Markdown & CSV";
};
export type ExportForm = PDFExportForm | HTMLExportForm | MarkdownCSVExportForm;

export async function Export(form: ExportForm) {
  const root = await Root();

  const overlay = await waitElement(
    "div.notion-overlay-container",
    root,
    TIMEOUT,
  );

  const export_dialog = await waitElement(
    'div[role="dialog"][aria-label="Export"]',
    overlay,
    TIMEOUT,
  );

  const findInput = (label_text: string) =>
    observeElement<HTMLElement>(
      (root, resolve) => {
        const labels = root.querySelectorAll<HTMLElement>(
          ":scope > div > div > div",
        );
        const label = Array.from(labels).find((e) =>
          e.innerText.trim() == label_text
        );
        if (label) {
          resolve(label.parentElement!);
        }
      },
      export_dialog,
      TIMEOUT,
      { subtree: true, childList: true },
    );

  const setInputDropdown = async (input: HTMLElement, value: string) => {
    const dropdown_button = await waitElement(
      'div[role="button"]',
      input,
      TIMEOUT,
    );
    await sleep(SLEEP_CLICK);
    dropdown_button.click();

    const item = await observeElement<HTMLElement>(
      (root, resolve) => {
        const items = root.querySelectorAll<HTMLElement>(
          'div[role="menuitem"]',
        );
        const item = Array.from(items).find((e) => e.innerText == value);
        if (item) {
          resolve(item);
        }
      },
      overlay,
      TIMEOUT,
      { subtree: true, childList: true },
    );
    await sleep(SLEEP_CLICK);
    item.click();
  };
  const setInputText = async (input: HTMLElement, value: string) => {
    const input_text = await waitElement<HTMLInputElement>(
      'input[type="text"]',
      input,
      TIMEOUT,
    );
    await sleep(SLEEP_CLICK);
    await setInput(input_text, value);
  };
  const setInputCheckbox = async (input: HTMLElement, value: boolean) => {
    const input_checkbox = await waitElement<HTMLInputElement>(
      'input[type="checkbox"]',
      input,
      TIMEOUT,
    );
    await sleep(SLEEP_CLICK);
    await setInput(input_checkbox, value);
  };

  const export_format_input = await findInput("Export format");
  await setInputDropdown(export_format_input, form.export_format);
  if (form.include_databases) {
    const include_databases_input = await findInput("Include databases");
    await setInputDropdown(include_databases_input, form.include_databases);
  }
  if (form.include_content) {
    const include_content_input = await findInput("Include content");
    await setInputDropdown(include_content_input, form.include_content);
  }
  if (form.include_subpages !== undefined) {
    const include_subpages_input = await findInput("Include subpages");
    await setInputCheckbox(include_subpages_input, form.include_subpages);
  }
  if (form.create_folders_for_subpages !== undefined) {
    const create_folders_for_subpages = await findInput(
      "Create folders for subpages",
    );
    // after disabled the input is not reactive with our approach
    // so we need to do it twice
    await setInputCheckbox(
      create_folders_for_subpages,
      !form.create_folders_for_subpages,
    );
    await setInputCheckbox(
      create_folders_for_subpages,
      form.create_folders_for_subpages,
    );
  }

  if (form.export_format == "PDF") {
    if (form.page_format) {
      const page_format_input = await findInput("Page format");
      await setInputDropdown(page_format_input, form.page_format);
    }
    if (form.scale_percent) {
      const scale_percent = await findInput("Scale percent");
      await setInputText(scale_percent, form.scale_percent.toString());
    }
  }

  if (form.export_format == "HTML") {
    if (form.export_comments !== undefined) {
      const export_comments_input = await findInput("Export comments");
      await setInputCheckbox(export_comments_input, form.export_comments);
    }
  }

  if (form.export_format == "Markdown & CSV") {}

  if (form.execute) {
    const export_button = await observeElement<HTMLElement>(
      (root, resolve) => {
        const buttons = root.querySelectorAll<HTMLElement>(
          'div[role="button"]',
        );
        const button = Array.from(buttons).find((e) => e.innerText == "Export");
        if (button) {
          resolve(button);
        }
      },
      export_dialog,
      TIMEOUT,
      { subtree: true, childList: true },
    );
    await sleep(SLEEP_CLICK);
    export_button.click();
  }
}

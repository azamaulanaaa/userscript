export class TableData {
  private raw: HTMLTableElement;

  constructor(element: HTMLTableElement) {
    this.raw = element;
  }

  headers_element(): HTMLTableHeaderCellElement[] {
    const headers_element = Array.from(this.raw.querySelectorAll<
      HTMLTableHeaderCellElement
    >(
      "thead > tr:nth-of-type(1) > th",
    ));
    return headers_element;
  }

  headers_text(): string[] {
    const headers_text = this.headers_element().map((e) => e.innerText);
    return headers_text;
  }

  headers_action_element(): HTMLTableHeaderCellElement[] {
    const headers_element = Array.from(this.raw.querySelectorAll<
      HTMLTableHeaderCellElement
    >(
      "thead > tr:nth-of-type(2) > th",
    ));
    return headers_element;
  }

  cells_element() {
    const rows_element = Array.from(this.raw.querySelectorAll("tbody > tr"));
    const cells_element = rows_element.map((e) =>
      Array.from(e.querySelectorAll("td"))
    );

    return cells_element;
  }

  cells_text() {
    const cells_element = this.cells_element();
    const cells_text = cells_element.map((row) =>
      row.map((cell) => cell.innerText)
    );

    return cells_text;
  }
}

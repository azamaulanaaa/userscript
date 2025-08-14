export function setInput<
  T extends HTMLInputElement,
>(
  input: T,
  value: string | boolean,
) {
  return new Promise<void>((resolve, reject) => {
    let lastValue: typeof value;
    let event_name: string;

    if (typeof value === "string") {
      lastValue = input.value;
      event_name = "input";
      input.value = value;
    } else if (typeof value === "boolean") {
      lastValue = input.checked;
      event_name = "click";
      input.checked = value;
    }

    if (!Object.hasOwn(input, "_valueTracker")) {
      reject(new Error('"_valueTracker" does not exist'));
      return;
    }
    // @ts-ignore react way to set previous value
    input._valueTracker?.setValue(lastValue);

    const event = new Event(event_name, { bubbles: true });
    input.dispatchEvent(event);

    resolve();
  });
}

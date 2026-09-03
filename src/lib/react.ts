/**
 * Programmatically set a React-controlled input value
 * by leveraging React's internal _valueTracker.
 */
export function setInput<T extends HTMLInputElement>(
  input: T,
  value: string | boolean,
): void {
  let lastValue: string | boolean;
  let eventName: string;

  if (typeof value === "string") {
    lastValue = input.value;
    eventName = "input";
    input.value = value;
  } else {
    lastValue = input.checked;
    eventName = "click";
    input.checked = value;
  }

  const tracker = (input as unknown as Record<string, { setValue(v: unknown): void }>)["_valueTracker"];
  if (!tracker) {
    throw new Error('"_valueTracker" does not exist — is this a React input?');
  }
  tracker.setValue(lastValue);

  input.dispatchEvent(new Event(eventName, { bubbles: true }));
}

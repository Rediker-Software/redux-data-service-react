import { simulateTextInput } from "../TestUtils";
/**
 * Simulates entering text into the fields within a form.
 * It will simulate entering text into each of the input fields whose name attribute matches the key on the
 * `newValues` object.
 *
 * @param wrapper - the enzyme wrapper
 * @param newValues - an object mapping input field name to new value
 */
export function simulateFormInput(wrapper, newValues) {
  for (const key in newValues) {
    if (newValues.hasOwnProperty(key)) {
      simulateTextInput(
        wrapper,
        wrapper.find(`input[name="${key}"]`).first(),
        newValues[key],
      );
    }
  }
}

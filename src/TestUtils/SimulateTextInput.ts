
/**
 * Simulates entering text into a field by passing event values to change and blur events
 *
 * @param wrapper - the enzyme wrapper
 * @param input - the field to update
 * @param text - the new text being entered into the field
 */
export function simulateTextInput(wrapper, input, text) {
  input.simulate("change", { target: { value: text } });
  wrapper.update();
  input.simulate("blur", { target: { value: text } });
  wrapper.update();
}

/**
 * Simulates an onBlur event
 *
 * @param wrapper - the enzyme wrapper
 * @param fieldName - the name attribute of the raw input field to update
 */
export function simulateBlurEvent(wrapper, fieldName) {
  const input = wrapper.find(`input[name="${fieldName}"]`).first();
  input.simulate("blur");
  wrapper.update();
}

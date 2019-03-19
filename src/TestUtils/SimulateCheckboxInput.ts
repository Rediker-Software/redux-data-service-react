/**
 * Simulates clicking on a checkbox.
 *
 * @param wrapper - the enzyme wrapper
 * @param name - the name of the field
 * @param checked - whether the checkbox is checked
 * @param value - the value of the checkbox
 */
export function simulateCheckboxInput(wrapper, name: string, checked: boolean, value?: string) {
  wrapper.find(`input[name="${name}"]`).first().simulate("change", {
    target: {
      checked,
      value,
    },
  });
  wrapper.update();
}

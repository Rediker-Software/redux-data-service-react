/**
 * Simulates clicking on a radio button
 * @param wrapper - the enzyme wrapper
 * @param id - the id of the selected object
 * @param name - the name of the field
 */
export function simulateRadioInput(wrapper, id: number, name: string) {
  wrapper.find("input[type='radio']").first().simulate("change", {
    target: {
      checked: "true",
      value: id.toString(),
      name,
    },
  });
  wrapper.update();
}

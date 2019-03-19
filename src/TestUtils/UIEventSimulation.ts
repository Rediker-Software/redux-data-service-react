/**
 * Simulates an onScroll event.
 *
 * @param wrapper - the enzyme wrapper
 * @param selector - the scrollable element
 * @param mock - optional mock event object to be passed in to the event handler ex: { currentTarget: { scrollTop: 50 } }
 */
export function simulateScrollEvent(wrapper, selector, mock?) {
  const scrollElement = wrapper.find(`${selector}`).first();
  scrollElement.simulate("scroll", mock);
  wrapper.update();
}

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

/**
 * Simulates an onFocus event
 *
 * @param wrapper - the enzyme wrapper
 * @param fieldName - the name attribute of the raw input field to update
 */
export function simulateFocusEvent(wrapper, fieldName) {
  const input = wrapper.find(`input[name="${fieldName}"]`).first();
  input.simulate("focus");
  wrapper.update();
}

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

/**
 * Simulates selecting an option from a Select
 * @param wrapper - the enzyme wrapper
 * @param selector - the element containing the Select
 * @param index - the index of the element
 */
export function simulateSelection(wrapper, selector, index) {
  wrapper
    .find(`${selector} [onClick]`)
    .last()
    .simulate("click");

  wrapper.update();

  wrapper
    .find("MenuItem")
    .at(index)
    .find("li")
    .simulate("click")
    .simulate("blur");
  wrapper
    .update();
}

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

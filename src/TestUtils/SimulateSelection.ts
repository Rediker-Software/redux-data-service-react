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

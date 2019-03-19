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

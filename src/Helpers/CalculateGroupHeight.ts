/**
 * Calculate the total height of a group of elements stacked vertically on a page,
 * given the first and last elements within the group.
 */
export function calculateGroupHeight(firstElement, lastElement) {
  if (!firstElement || !lastElement) {
    return undefined;
  }

  const start = firstElement.getBoundingClientRect().top;
  const end = lastElement.getBoundingClientRect().bottom;

  return end - start;
}

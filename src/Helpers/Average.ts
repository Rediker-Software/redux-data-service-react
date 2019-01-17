/**
 *  Computes the average of the given array of numbers
 */
export function average(items: number[]) {
  let total = 0;

  if (items.length === 0) {
    return 0;
  }

  for (const value of items) {
    total += value;
  }

  return total / items.length;
}

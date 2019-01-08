import { mapProps } from "recompose";
import { omit } from "lodash/fp";

export function omitProps<P>(keys: (keyof P)[]) {
  return mapProps<P, Partial<P>>(props => omit(keys, props));
}

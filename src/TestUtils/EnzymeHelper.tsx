import * as React from "react";
import { mount, ReactWrapper } from "enzyme";

/**
 * Helper function to handle mounting and unmounting a component using enzyme to ensure resources are cleaned up.
 *
 * @param component Component to mount in wrapper
 * @param whileMounted Function to execute while component is mounted
 * @param mountOptions options passed into mount as second param
 */
export function usingMount(
  component: React.ComponentType<any> | JSX.Element,
  whileMounted: (wrapper: ReactWrapper) => Promise<any> | void,
  mountOptions = {},
): Promise<any> | void {
  let wrapper;
  let promise;
  try {
    wrapper = mount(component, mountOptions);

    promise = whileMounted(wrapper);
  } finally {
    if (promise instanceof Promise) {
      promise
        .then(() => wrapper.unmount())
        .catch(() => wrapper.unmount());
    } else if (wrapper) {
      wrapper.unmount();
    }
  }

  return (promise instanceof Promise) ? promise : undefined;
}

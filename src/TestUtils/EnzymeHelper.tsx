import * as React from "react";
import { mount, ReactWrapper } from "enzyme";

/**
 * Helper function to handle mounting and unmounting a component using enzyme to ensure resources are cleaned up.
 *
 * @param component Component to mount in wrapper
 * @param whileMounted Function to execute while component is mounted
 * @param mountOptions options passed into mount as second param
 */
export function usingMount(component: React.ComponentType<any> | JSX.Element, whileMounted: (wrapper: ReactWrapper) => void, mountOptions = {}) {
  let wrapper;
  try {
    wrapper = mount(component, mountOptions);
    whileMounted(wrapper);
  } finally {
    if (wrapper) {
      wrapper.unmount();
    }
  }
}

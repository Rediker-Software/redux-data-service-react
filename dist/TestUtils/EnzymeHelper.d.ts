import * as React from "react";
import { ReactWrapper } from "enzyme";
export declare function usingMount(component: React.ComponentType<any> | JSX.Element, whileMounted: (wrapper: ReactWrapper) => Promise<any> | void, mountOptions?: {}): Promise<any> | void;

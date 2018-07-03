import * as React from "react";
import { ReactWrapper } from "enzyme";
import "./TestSetup";
export declare function usingMount(component: React.ComponentType<any> | JSX.Element, whileMounted: (wrapper: ReactWrapper) => void, mountOptions?: {}): void;

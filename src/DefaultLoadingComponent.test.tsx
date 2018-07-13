// tslint:disable:max-classes-per-file no-unused-expression

import * as React from "react";

import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { DefaultLoadingComponent } from "./DefaultLoadingComponent";

declare var intern;
const { describe, it } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

configure({ adapter: new Adapter() });

describe("<DefaultLoadingComponent />", () => {

  it("displays loading text", () => {
    const wrapper = shallow(<DefaultLoadingComponent/>);
    expect(wrapper.text()).to.equal("Loading...");
  });
});

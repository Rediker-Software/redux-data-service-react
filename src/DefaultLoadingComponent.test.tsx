// tslint:disable:max-classes-per-file no-unused-expression

import * as React from "react";

import { shallow } from "enzyme";

import "./TestUtils/TestSetup";
import { DefaultLoadingComponent } from "./DefaultLoadingComponent";

declare var intern;
const { describe, it } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("<DefaultLoadingComponent />", () => {

  it("displays loading text", () => {
    const wrapper = shallow(<DefaultLoadingComponent/>);
    expect(wrapper.text()).to.equal("Loading...");
  });
});

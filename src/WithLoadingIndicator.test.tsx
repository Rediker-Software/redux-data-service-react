// tslint:disable no-unused-expression

import * as React from "react";

import { shallow } from "enzyme";
import { spy, stub } from "sinon";

import "./TestUtils/TestSetup";
import { defaultShowLoadingIndicator, withLoadingIndicator } from "./WithLoadingIndicator";
import { FakeComponent, usingMount } from "./TestUtils";

declare var intern;
const { describe, it } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("withLoadingIndicator", () => {

  it("renders a spinner when isLoading is true", () => {
    const Component = withLoadingIndicator(defaultShowLoadingIndicator, FakeComponent)(() => <span/>);
    usingMount(<Component isLoading/>, (wrapper) => {
      expect(wrapper.find(FakeComponent).exists()).to.be.true;
    });
  });

  it("does not render a spinner when isLoading is false", () => {
    const Component = withLoadingIndicator()(() => <span/>);
    usingMount(<Component/>, (wrapper) => {
      expect(wrapper.find(FakeComponent).exists()).to.be.false;
    });
  });
});

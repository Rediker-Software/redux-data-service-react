// tslint:disable no-unused-expression
import * as React from "react";

import { spy } from "sinon";
import { usingMount } from "./TestUtils";
import "./TestUtils/TestSetup";

import { withDelayedHandlers } from "./WithDelayedHandlers";

declare var intern;
const { describe, it, beforeEach } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("withDelayedHandlers() HOC", () => {

  let Component;
  let delayedCallback;

  beforeEach(() => {
    delayedCallback = spy();

    Component = withDelayedHandlers({
      onClick: () => () => delayedCallback
    })(() => <span />);
  });

  it("renders a component wrapped by withDelayedHandlers() HOC", () => {
    usingMount(
      <Component />,
      wrapper => expect(wrapper.find("span").exists()).to.be.true
    );
  });

  it("passes the callbacks to the wrapped component", () => {
    expect(false).to.be.true;
  });

  it("throttles and debounces the callback", () => {
    expect(false).to.be.true;
  });

  it("only throttles the callback when enableDebunce is true", () => {
    expect(false).to.be.true;
  });

  it("only debounces the callback when enableThrottle is true", () => {
    expect(false).to.be.true;
  });

});

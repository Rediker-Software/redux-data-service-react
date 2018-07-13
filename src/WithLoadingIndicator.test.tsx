// tslint:disable no-unused-expression

import * as React from "react";

import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { spy, stub } from "sinon";

import { defaultShowLoadingIndicator, withLoadingIndicator } from "./WithLoadingIndicator";
import { DefaultLoadingComponent } from "./DefaultLoadingComponent";
import { FakeComponent, usingMount } from "./TestUtils";

declare var intern;
const { describe, it, beforeEach } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

configure({ adapter: new Adapter() });

describe("withLoadingIndicator", () => {

  let exampleComponent;

  beforeEach(() => {
    exampleComponent = () => <span>hello world!</span>;
  });

  it("by default renders a loading component when isLoading is true", () => {
    const Component = withLoadingIndicator()(exampleComponent);
    usingMount(<Component isLoading/>, (wrapper) => {
      expect(wrapper.find(DefaultLoadingComponent).exists()).to.be.true;
    });
  });

  it("by default does not render a loading component when isLoading is false", () => {
    const Component = withLoadingIndicator()(exampleComponent);
    usingMount(<Component/>, (wrapper) => {
      expect(wrapper.text()).to.equal("hello world!");
    });
  });

  it("uses an optional test function to determine if it should show the loading indicator", () => {
    const test = () => true;
    const Component = withLoadingIndicator(test)(exampleComponent);
    usingMount(<Component/>, (wrapper) => {
      expect(wrapper.find(DefaultLoadingComponent).exists()).to.be.true;
    });
  });

  it("renders the default loading component if one is not given", () => {
    const Component = withLoadingIndicator()(exampleComponent);
    usingMount(<Component isLoading/>, (wrapper) => {
      expect(wrapper.find(DefaultLoadingComponent).exists()).to.be.true;
    });
  });

  it("renders the given loading component", () => {
    const Component = withLoadingIndicator(defaultShowLoadingIndicator, FakeComponent)(exampleComponent);
    usingMount(<Component isLoading/>, (wrapper) => {
      expect(wrapper.find(FakeComponent).exists()).to.be.true;
    });
  });

  it("renders the loading component specified as a prop", () => {
    const Component = withLoadingIndicator()(exampleComponent);
    usingMount(<Component isLoading loadingComponent={FakeComponent}/>, (wrapper) => {
      expect(wrapper.find(FakeComponent).exists()).to.be.true;
    });
  });
});

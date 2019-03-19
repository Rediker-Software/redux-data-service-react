// tslint:disable no-unused-expression
import * as React from "react";
import { fakeModelModule, IFakeModel, initializeTestServices, seedService } from "redux-data-service";

import { usingMount } from "../TestUtils";
import "TestUtils/TestSetup";

import { withModelFormBody } from "./WithModelFormBody";

declare var intern;
const { describe, it, beforeEach } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("withModelFormBody HOC", () => {
  let Component;

  beforeEach(() => {
    initializeTestServices(fakeModelModule);
    Component = withModelFormBody<IFakeModel>()(({ model }) => <span>{model.fullText}</span>);
  });

  it("renders a component wrapped by withModelFormBody()", () => {
    const fakeModel = seedService("fakeModel") as IFakeModel;

    usingMount(
      <Component model={fakeModel}/>,
      wrapper => expect(wrapper.exists()).to.be.true
    );
  });

});

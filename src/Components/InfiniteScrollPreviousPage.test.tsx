// tslint:disable no-unused-expression
import * as React from "react";

import { usingMount } from "../TestUtils";
import "TestUtils/TestSetup";

import { InfiniteScrollPreviousPage } from "./InfiniteScrollPreviousPage";
import { fakeModelModule, initializeTestServices, QueryBuilder } from "redux-data-service";

declare var intern;
const { describe, it, beforeEach } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("<InfiniteScrollPreviousPage />", () => {

  beforeEach(() => {
    initializeTestServices(fakeModelModule);
  });

  it("renders a <InfiniteScrollPreviousPage />", () => {
    const query = new QueryBuilder("fakeModel");
    usingMount(
      <InfiniteScrollPreviousPage
        query={query}
        modelComponent={() => <span />}
      />,
      wrapper => expect(wrapper.find(InfiniteScrollPreviousPage).exists()).to.be.true
    );
  });

});

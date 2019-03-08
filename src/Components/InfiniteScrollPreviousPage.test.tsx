// tslint:disable no-unused-expression
import * as React from "react";
import { fakeModelModule, initializeTestServices, QueryBuilder } from "redux-data-service";

import { seedServiceListWithPagingOptions, usingMount } from "../TestUtils";
import "../TestUtils/TestSetup";

import { InfiniteScrollPreviousPage } from "./InfiniteScrollPreviousPage";

declare var intern;
const { describe, it, beforeEach } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("<InfiniteScrollPreviousPage />", () => {

  const ModelComponent = ({ model }) => (
    <div className={model.fullText}>
      {model.fullText}
    </div>
  );

  let fakeService;
  let pageSize;
  let totalPages;
  let delayTimeout;

  beforeEach(() => {
    fakeService = "fakeModel";
    pageSize = 10;
    totalPages = 10;
    delayTimeout = 200;

    initializeTestServices(fakeModelModule);
    seedServiceListWithPagingOptions(fakeService, pageSize, totalPages);
  });

  it("renders a <InfiniteScrollPreviousPage />", () => {
    const query = new QueryBuilder("fakeModel");

    usingMount(
      <InfiniteScrollPreviousPage
        query={query}
        modelComponent={ModelComponent}
      />,
      wrapper => expect(wrapper.find(InfiniteScrollPreviousPage).exists()).to.be.true
    );
  });

  it("loads all previous pages", async () => {
    const query = new QueryBuilder("fakeModel", { page: 4 });

    await usingMount(
      <InfiniteScrollPreviousPage
        query={query}
        modelComponent={ModelComponent}
      />, wrapper => {
        expect(wrapper.find(".page1")).to.have.lengthOf(pageSize);
        expect(wrapper.find(".page2")).to.have.lengthOf(pageSize);
        expect(wrapper.find(".page3")).to.have.lengthOf(pageSize);
        expect(wrapper.find(".page4")).to.have.lengthOf(pageSize);
      },
    );
  });

});

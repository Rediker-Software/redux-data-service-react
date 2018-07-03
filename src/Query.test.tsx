// tslint:disable:max-classes-per-file no-unused-expression

import * as React from "react";
import { fakeModelModule, initializeTestServices, seedServiceList } from "redux-data-service";

import { spy, stub } from "sinon";
import { lorem, random } from "faker";

import { usingMount } from "./TestUtils";
import { Query } from "./Query";

declare var intern;
const { describe, it, beforeEach } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("<Query />", () => {
  let items;
  let query;
  let Component;
  const numItems = 5;

  beforeEach(() => {
    initializeTestServices(fakeModelModule);

    query = { organizationId: random.number().toString() };
    items = seedServiceList("fakeModel", numItems, query);

    Component = (
      <Query modelName="fakeModel" query={query}>
        {(props) => <ul>{props.items.map(item => <li key={item.id}>{item.fullText}</li>)}</ul>}
      </Query>
    );
  });

  it("renders the component with the correct number of items", () => {
    usingMount(Component, (wrapper) => {
      expect(wrapper.find("li").length).to.equal(numItems);
    });
  });

  it("returns a component with the correct list of items", () => {
    usingMount(Component, (wrapper) => {
      const texts = wrapper.find("li").map(node => node.text());
      expect(texts).to.deep.equal(items.map(item => item.fullText));
    });
  });
});

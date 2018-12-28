import * as React from "react";
import { initializeTestServices, seedServiceList } from "redux-data-service";

import { usingMount, simulateScrollEvent } from "TestUtils";

import "TestUtils/TestSetup";
import modules from "Modules";

import { InfiniteScroll } from "./InfiniteScroll";
import { Paper } from "@material-ui/core";
import { compose, setDisplayName } from "recompose";
import { withStyle } from "Style";

declare var intern;
const { describe, it, beforeEach } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("<InfiniteScroll />", () => {
  const TestContainer = compose<{}, {}>(
    setDisplayName("TestContainer"),
    withStyle({
      height: 50,
      width: 50,
    }),
  )(({ children, ...props }) => (
    <Paper {...props}>
      {children}
    </Paper>
  ));

  interface IPaperContainerItemProps {
    item: any;
    displayValueField: string;
  }

  const TestContainerItem = compose<IPaperContainerItemProps, IPaperContainerItemProps>(
    setDisplayName("TestContainerItem"),
    withStyle({
      height: 10,
      width: 10,
    }),
  )(({ children, ...props }) => (
    <Paper {...props}>
      Test Item Text
    </Paper>
  ));

  beforeEach(() => {
    initializeTestServices(modules);
    seedServiceList<any>("person", 10, { organizationId: "1", pageNumber: 1 });
    seedServiceList<any>("person", 10, { organizationId: "1", pageNumber: 2 });
    seedServiceList<any>("person", 10, { organizationId: "1", pageNumber: 3 });
    seedServiceList<any>("person", 10, { organizationId: "1", pageNumber: 4 });
  });

  it("renders an <InfiniteScroll/>", () => {
    usingMount(
      <InfiniteScroll
        containerComponent={TestContainer}
        itemComponent={TestContainerItem}
        serviceName="person"
      />, wrapper =>
        expect(wrapper.find("InfiniteScroll").exists()).to.be.true
    );
  });

  it("renders the given container component", () => {
    usingMount(
      <InfiniteScroll
        containerComponent={TestContainer}
        itemComponent={TestContainerItem}
        serviceName="person"
      />, wrapper =>
        expect(wrapper.find("TestContainer").exists()).to.be.true
    );
  });

  it("passes container props to container component when container props are given", () => {
    usingMount(
      <InfiniteScroll
        containerComponent={TestContainer}
        containerProps={{ testContainerProp: "testing container prop" }}
        itemComponent={TestContainerItem}
        serviceName="person"
      />, wrapper =>
        expect(wrapper.find("TestContainer").prop("testContainerProp")).to.equal("testing container prop")
    );
  });

  it("renders the given item component", () => {
    usingMount(
      <InfiniteScroll
        containerComponent={TestContainer}
        itemComponent={TestContainerItem}
        serviceName="person"
      />, wrapper =>
        expect(wrapper.find("TestContainerItem").exists()).to.be.true
    );
  });

  it("passes item props to item component when item props are given", () => {
    usingMount(
      <InfiniteScroll
        containerComponent={TestContainer}
        itemComponent={TestContainerItem}
        itemProps={{ testItemProp: "testing item prop" }}
        serviceName="person"
      />, wrapper =>
        expect(wrapper.find("TestContainerItem").first().prop("testItemProp")).to.equal("testing item prop")
    );
  });

  describe("Initial page loads", () => {
    it("loads expected page", () => {
      usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          itemComponent={TestContainerItem}
          itemProps={{ testItemProp: "testing item prop" }}
          queryParams={{ pageNumber: 3 }}
          serviceName="person"
        />, wrapper =>
          expect(wrapper.find("ComponentFromStream").last().prop("query")).to.deep.equal({ pageNumber: 3 })
      );
    });

   /* it("loads existing next page", () => {
      usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          itemComponent={TestContainerItem}
          itemProps={{ testItemProp: "testing item prop" }}
          queryParams={{ pageNumber: 3 }}
          serviceName="person"
        />, wrapper =>
          expect(wrapper.find("ComponentFromStream").last().prop("query")).to.deep.equal("{ pageNumber: 4 }")
      );
    });

    it("loads existing previous page", () => {
      usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          itemComponent={TestContainerItem}
          itemProps={{ testItemProp: "testing item prop" }}
          queryParams={{ pageNumber: 3 }}
          serviceName="person"
        />, wrapper =>
          expect(wrapper.find("ComponentFromStream").first().prop("query")).to.deep.equal("{ pageNumber: 2 }")
      );
    }); */
  });

  /*describe("Scrolling Events", () => {
    it("loads new next page when scrolling down, scroll bottom height is less than the client height and next page exists", () => {
      usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          itemComponent={TestContainerItem}
          itemProps={{ testItemProp: "testing item prop" }}
          serviceName="person"
        />, wrapper => {
          simulateScrollEvent(wrapper, "Scrollbar", { currentTarget: { scrollTop: 110 } }); //, clientHeight: 50, scrollHeight: 200 } });
          return expect(wrapper.find("Query").first().prop("query")).to.equal("{ pageNumber: 3 }");
        }
      );
    });

    it("loads new previous page when scrolling up, scroll top height is less than the client height and previous page exists", () => {
      usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          itemComponent={TestContainerItem}
          itemProps={{ testItemProp: "testing item prop" }}
          queryParams={{ pageNumber: 3 }}
          serviceName="person"
        />, wrapper => {
          simulateScrollEvent(wrapper, "Scrollbar", { currentTarget: { scrollTop: 10 } }); //, clientHeight: 50, scrollHeight: 200 } }); 
          simulateScrollEvent(wrapper, "Scrollbar", { currentTarget: { scrollTop: 0 } }); //, clientHeight: 50, scrollHeight: 200 } });
          return expect(wrapper.find("Query").last().prop("query")).to.equal("{ pageNumber: 1 }");
        }
      );
    });

    it("page load is unchanged when scrolling down and next page does not exist", () => {
      usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          itemComponent={TestContainerItem}
          itemProps={{ testItemProp: "testing item prop" }}
          serviceName="person"
        />, wrapper =>
          expect(wrapper.find("TestContainerItem").first().prop("testItemProp")).to.equal("testing item prop")
      );
    });

    it("page load is unchanged when scrolling down and scroll bottom height is not less than client height", () => {
      usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          itemComponent={TestContainerItem}
          itemProps={{ testItemProp: "testing item prop" }}
          serviceName="person"
        />, wrapper =>
          expect(wrapper.find("TestContainerItem").first().prop("testItemProp")).to.equal("testing item prop")
      );
    });

    it("page load is unchanged when scrolling up and previous page does not exist", () => {
      usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          itemComponent={TestContainerItem}
          itemProps={{ testItemProp: "testing item prop" }}
          serviceName="person"
        />, wrapper =>
          expect(wrapper.find("TestContainerItem").first().prop("testItemProp")).to.equal("testing item prop")
      );
    });

    it("page load is unchanged when scrolling up and scroll top height is not less than client height", () => {
      usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          itemComponent={TestContainerItem}
          itemProps={{ testItemProp: "testing item prop" }}
          serviceName="person"
        />, wrapper =>
          expect(wrapper.find("TestContainerItem").first().prop("testItemProp")).to.equal("testing item prop")
      );
    });

    it("page load is unchanged when scroll top equals last scroll top value", () => {
      usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          itemComponent={TestContainerItem}
          itemProps={{ testItemProp: "testing item prop" }}
          serviceName="person"
        />, wrapper =>
          expect(wrapper.find("TestContainerItem").first().prop("testItemProp")).to.equal("testing item prop")
      );
    });
  });*/
});

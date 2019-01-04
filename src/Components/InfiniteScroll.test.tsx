import * as React from "react";
import { fakeModelModule, initializeTestServices, seedServiceList } from "redux-data-service";

import { InfiniteScroll } from "./InfiniteScroll";

import { simulateScrollEvent, usingMount } from "../TestUtils";
import "../TestUtils/TestSetup";

declare var intern;
const { beforeEach, describe, it } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("<InfiniteScroll />", () => {
  const testContainerHeight = 50;

  const TestContainer = (props) => {
    const style = {
      height: testContainerHeight,
      width: 50,
      overflow: "auto",
    };

    return (
      <div style={style} {...props}>
        {props.children}
      </div>
    );
  };

  interface IPaperContainerItemProps {
    item: any;
    displayValueField: string;
  }

  const testContainerItemHeight = 10;

  const testContainerItemStyle = {
    height: testContainerItemHeight,
  };

  const TestContainerItem = ({ children, model, ...props }) => (
    <span style={testContainerItemStyle} className={model.fullText}>
      {model.fullText}
    </span>
  );

  const fakeService = "fakeModel";
  const itemsPerPage = 10;

  beforeEach(() => {
    initializeTestServices(fakeModelModule);

    seedServiceList<any>("fakeModel", itemsPerPage, { fullText: "page1" }, { queryParams: { page: 1 }, hasNext: true, nextPage: 2, hasPrevious: false });
    seedServiceList<any>("fakeModel", itemsPerPage, { fullText: "page10" }, { queryParams: { page: 10 }, hasNext: false, hasPrevious: true, previousPage: 9 });

    for (let i = 2; i < 10; i++) {
      seedServiceList<any>(
        "fakeModel",
        itemsPerPage,
        { fullText: `page${i}` },
        { queryParams: { page: i }, hasNext: true, nextPage: i + 1, hasPrevious: true, previousPage: i - 1 },
      );
    }
  });

  it("renders an <InfiniteScroll/>", () => {
    usingMount(
      <InfiniteScroll
        containerComponent={TestContainer}
        modelComponent={TestContainerItem}
        query={{ page: 3 }}
        modelName={fakeService}
      />, wrapper =>
        expect(wrapper.find("InfiniteScroll").exists()).to.be.true,
    );
  });

  it("renders the given container component", () => {
    usingMount(
      <InfiniteScroll
        containerComponent={TestContainer}
        modelComponent={TestContainerItem}
        query={{ page: 3 }}
        modelName={fakeService}
      />, wrapper =>
        expect(wrapper.find("TestContainer").exists()).to.be.true,
    );
  });

  it("passes container props to container component when container props are given", () => {
    usingMount(
      <InfiniteScroll
        containerComponent={TestContainer}
        containerProps={{ className: "testing container prop" }}
        modelComponent={TestContainerItem}
        query={{ page: 3 }}
        modelName={fakeService}
      />, wrapper =>
        expect(wrapper.find("TestContainer").prop("className")).to.equal("testing container prop"),
    );
  });

  it("renders the given item component", () => {
    usingMount(
      <InfiniteScroll
        containerComponent={TestContainer}
        modelComponent={TestContainerItem}
        query={{ page: 3 }}
        modelName={fakeService}
      />, wrapper =>
        expect(wrapper.find("TestContainerItem").exists()).to.be.true,
    );
  });

  it("passes item props to item component when item props are given", () => {
    usingMount(
      <InfiniteScroll
        containerComponent={TestContainer}
        modelComponent={TestContainerItem}
        modelComponentProps={{ testItemProp: "testing item prop" }}
        query={{ page: 3 }}
        modelName={fakeService}
      />, wrapper =>
        expect(wrapper.find("TestContainerItem").first().prop("testItemProp")).to.equal("testing item prop"),
    );
  });

  describe("Initial page loads", () => {
    it("loads expected page", () => {
      usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          modelComponent={TestContainerItem}
          modelComponentProps={{ testItemProp: "testing item prop" }}
          query={{ page: 3 }}
          modelName={fakeService}
        />, wrapper =>
          expect(wrapper.find("ComponentFromStream").first().prop("query")).to.deep.include({ queryParams: { page: 3 } }),
      );
    });

    it("loads existing next page", () => {
      usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          modelComponent={TestContainerItem}
          modelComponentProps={{ testItemProp: "testing item prop" }}
          query={{ page: 3 }}
          modelName={fakeService}
        />, wrapper =>
          expect(wrapper.find("ComponentFromStream").last().prop("query")).to.deep.include({ queryParams: { page: 4 } }),
      );
    });

    it("loads all previous pages", () => {
      usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          modelComponent={TestContainerItem}
          modelComponentProps={{ testItemProp: "testing item prop" }}
          query={{ page: 4 }}
          modelName={fakeService}
        />, wrapper => {
          expect(wrapper.find(".page1")).to.have.lengthOf(10);
          expect(wrapper.find(".page2")).to.have.lengthOf(10);
          expect(wrapper.find(".page3")).to.have.lengthOf(10);
        },
      );
    });
  });

  describe("Scrolling Events", () => {
    it("loads new next page when scrolling down, scroll bottom height is less than half the client height and next page exists", async () => {
      const debounceTime = 200;

      await usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          modelComponent={TestContainerItem}
          modelComponentProps={{ testItemProp: "testing item prop" }}
          query={{ page: 3 }}
          modelName={fakeService}
          debounceTime={debounceTime}
        />, wrapper => {
          return new Promise((resolve, reject) => {
            simulateScrollEvent(wrapper, "TestContainer", { target: { scrollTop: 200, clientHeight: 50, scrollHeight: 200 } });

            setTimeout(() => {
              try {
                wrapper.update();
                expect(wrapper.find(".page5")).to.have.lengthOf(10);
                resolve();
              } catch (e) {
                reject(e);
              }
            }, debounceTime + 100);
          });
        },
      );
    });

    it("page load is unchanged when scrolling down and next page does not exist", async () => {
      const debounceTime = 200;

      await usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          modelComponent={TestContainerItem}
          modelComponentProps={{ testItemProp: "testing item prop" }}
          query={{ page: 10 }}
          modelName={fakeService}
          debounceTime={debounceTime}
        />, wrapper => {
          return new Promise((resolve, reject) => {
            expect(wrapper.find("TestContainerItem")).to.have.lengthOf(100); // verify page load before scrolling
            simulateScrollEvent(wrapper, "TestContainer", { target: { scrollTop: 200, clientHeight: 50, scrollHeight: 200 } });

            setTimeout(() => {
              try {
                wrapper.update();
                expect(wrapper.find("TestContainerItem")).to.have.lengthOf(100); // verify pageload is unchanged
                resolve();
              } catch (e) {
                reject(e);
              }
            }, debounceTime + 100);
          });
        },
      );
    });

    it("page load is unchanged when scrolling down and scroll bottom height is not less than client height", async () => {
      const debounceTime = 200;

      await usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          modelComponent={TestContainerItem}
          modelComponentProps={{ testItemProp: "testing item prop" }}
          query={{ page: 2 }}
          modelName={fakeService}
          debounceTime={debounceTime}
        />, wrapper => {
          return new Promise((resolve, reject) => {
            expect(wrapper.find("TestContainerItem")).to.have.lengthOf(30); // verify page load before scrolling
            simulateScrollEvent(wrapper, "TestContainer", { target: { scrollTop: 100, clientHeight: 50, scrollHeight: 200 } });

            setTimeout(() => {
              try {
                wrapper.update();
                expect(wrapper.find("TestContainerItem")).to.have.lengthOf(30); // verify pageload is unchanged
                resolve();
              } catch (e) {
                reject(e);
              }
            }, debounceTime + 100);
          });
        },
      );
    });

    it("page load is unchanged when scroll top equals last scroll top value", async () => {
      const debounceTime = 200;

      await usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          modelComponent={TestContainerItem}
          modelComponentProps={{ testItemProp: "testing item prop" }}
          query={{ page: 2 }}
          modelName={fakeService}
          debounceTime={debounceTime}
        />, wrapper => {
          return new Promise((resolve, reject) => {
            expect(wrapper.find("TestContainerItem")).to.have.lengthOf(30); // verify page load before scrolling
            simulateScrollEvent(wrapper, "TestContainer", { target: { scrollTop: 0, clientHeight: 50, scrollHeight: 200 } });

            setTimeout(() => {
              try {
                wrapper.update();
                expect(wrapper.find("TestContainerItem")).to.have.lengthOf(30); // verify pageload is unchanged
                resolve();
              } catch (e) {
                reject(e);
              }
            }, debounceTime + 100);
          });
        },
      );
    });
  });
});

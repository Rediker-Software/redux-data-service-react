import * as React from "react";
import { fakeModelModule, initializeTestServices } from "redux-data-service";

import { InfiniteScroll } from "./InfiniteScroll";

import { seedServiceListWithPagingOptions, simulateScrollEvent, usingMount } from "../TestUtils";
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

  const testContainerModelHeight = 10;

  const testContainerModelStyle = {
    height: testContainerModelHeight,
  };

  const TestContainerModel = ({ model }) => (
    <span style={testContainerModelStyle} className={model.fullText}>
      {model.fullText}
    </span>
  );

  const fakeService = "fakeModel";
  const pageSize = 10;
  const totalPages = 10;
  const debounceTime = 200;

  initializeTestServices(fakeModelModule);
  seedServiceListWithPagingOptions(fakeService, pageSize, totalPages);

  it("renders an <InfiniteScroll/>", () => {
    usingMount(
      <InfiniteScroll
        containerComponent={TestContainer}
        modelComponent={TestContainerModel}
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
        modelComponent={TestContainerModel}
        query={{ page: 3 }}
        modelName={fakeService}
      />, wrapper =>
        expect(wrapper.find("TestContainer").exists()).to.be.true,
    );
  });

  it("passes extra props to container component when extra props are given", () => {
    usingMount(
      <InfiniteScroll
        containerComponent={TestContainer}
        extraProp="testing extra prop"
        modelComponent={TestContainerModel}
        query={{ page: 3 }}
        modelName={fakeService}
      />, wrapper =>
        expect(wrapper.find("TestContainer").prop("extraProp")).to.equal("testing extra prop"),
    );
  });

  it("renders the given model component", () => {
    usingMount(
      <InfiniteScroll
        containerComponent={TestContainer}
        modelComponent={TestContainerModel}
        query={{ page: 3 }}
        modelName={fakeService}
      />, wrapper =>
        expect(wrapper.find("TestContainerModel").exists()).to.be.true,
    );
  });

  it("passes model props to model component when model props are given", () => {
    usingMount(
      <InfiniteScroll
        containerComponent={TestContainer}
        modelComponent={TestContainerModel}
        modelComponentProps={{ testModelProp: "testing model prop" }}
        query={{ page: 3 }}
        modelName={fakeService}
      />, wrapper =>
        expect(wrapper.find("TestContainerModel").first().prop("testModelProp")).to.equal("testing model prop"),
    );
  });

  describe("Initial page loads", () => {
    it("loads expected page", () => {
      usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          modelComponent={TestContainerModel}
          modelComponentProps={{ testModelProp: "testing model prop" }}
          query={{ page: 5 }}
          modelName={fakeService}
        />, wrapper =>
          expect(wrapper.find(".page5")).to.have.lengthOf(pageSize),
      );
    });

    it("loads existing previous page", () => {
      usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          modelComponent={TestContainerModel}
          modelComponentProps={{ testModelProp: "testing model prop" }}
          query={{ page: 5 }}
          modelName={fakeService}
        />, wrapper =>
          expect(wrapper.find(".page4")).to.have.lengthOf(pageSize),
      );
    });

    it("loads existing next page", () => {
      usingMount(
        <InfiniteScroll
          containerComponent={TestContainer}
          modelComponent={TestContainerModel}
          modelComponentProps={{ testModelProp: "testing model prop" }}
          query={{ page: 5 }}
          modelName={fakeService}
        />, wrapper =>
          expect(wrapper.find(".page6")).to.have.lengthOf(pageSize),
      );
    });

    describe("Infinite Scroll Style", () => {

      it("loads all previous pages", () => {
        usingMount(
          <InfiniteScroll
            containerComponent={TestContainer}
            modelComponent={TestContainerModel}
            modelComponentProps={{ testModelProp: "testing model prop" }}
            query={{ page: 5 }}
            modelName={fakeService}
            disableVirtualScrolling
          />, wrapper => {
            expect(wrapper.find(".page1")).to.have.lengthOf(pageSize);
            expect(wrapper.find(".page2")).to.have.lengthOf(pageSize);
            expect(wrapper.find(".page3")).to.have.lengthOf(pageSize);
            expect(wrapper.find(".page4")).to.have.lengthOf(pageSize);
          },
        );
      });

      describe("Scrolling Events", () => {
        it("loads new next page when scrolling down, scroll bottom height is less than half the client height and next page exists", async () => {
          await usingMount(
            <InfiniteScroll
              containerComponent={TestContainer}
              modelComponent={TestContainerModel}
              modelComponentProps={{ testModelProp: "testing model prop" }}
              query={{ page: 3 }}
              modelName={fakeService}
              disableVirtualScrolling
              debounceTime={debounceTime}
            />, wrapper => {
              return new Promise((resolve, reject) => {
                simulateScrollEvent(wrapper, "TestContainer", { target: { scrollTop: 200, clientHeight: 50, scrollHeight: 200 } });

                setTimeout(() => {
                  try {
                    wrapper.update();
                    expect(wrapper.find("TestContainerModel")).to.have.lengthOf(50);
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
          await usingMount(
            <InfiniteScroll
              containerComponent={TestContainer}
              modelComponent={TestContainerModel}
              modelComponentProps={{ testModelProp: "testing model prop" }}
              query={{ page: 10 }}
              modelName={fakeService}
              disableVirtualScrolling
              debounceTime={debounceTime}
            />, wrapper => {
              return new Promise((resolve, reject) => {
                expect(wrapper.find("TestContainerModel")).to.have.lengthOf(100); // verify page load before scrolling
                simulateScrollEvent(wrapper, "TestContainer", { target: { scrollTop: 200, clientHeight: 50, scrollHeight: 200 } });

                setTimeout(() => {
                  try {
                    wrapper.update();
                    expect(wrapper.find("TestContainerModel")).to.have.lengthOf(100); // verify pageload is unchanged
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
          await usingMount(
            <InfiniteScroll
              containerComponent={TestContainer}
              modelComponent={TestContainerModel}
              modelComponentProps={{ testModelProp: "testing model prop" }}
              query={{ page: 2 }}
              modelName={fakeService}
              disableVirtualScrolling
              debounceTime={debounceTime}
            />, wrapper => {
              return new Promise((resolve, reject) => {
                expect(wrapper.find("TestContainerModel")).to.have.lengthOf(30); // verify page load before scrolling
                simulateScrollEvent(wrapper, "TestContainer", { target: { scrollTop: 100, clientHeight: 50, scrollHeight: 200 } });

                setTimeout(() => {
                  try {
                    wrapper.update();
                    expect(wrapper.find("TestContainerModel")).to.have.lengthOf(30); // verify pageload is unchanged
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
          await usingMount(
            <InfiniteScroll
              containerComponent={TestContainer}
              modelComponent={TestContainerModel}
              modelComponentProps={{ testModelProp: "testing model prop" }}
              query={{ page: 2 }}
              modelName={fakeService}
              disableVirtualScrolling
              debounceTime={debounceTime}
            />, wrapper => {
              return new Promise((resolve, reject) => {
                expect(wrapper.find("TestContainerModel")).to.have.lengthOf(30); // verify page load before scrolling
                simulateScrollEvent(wrapper, "TestContainer", { target: { scrollTop: 0, clientHeight: 50, scrollHeight: 200 } });

                setTimeout(() => {
                  try {
                    wrapper.update();
                    expect(wrapper.find("TestContainerModel")).to.have.lengthOf(30); // verify pageload is unchanged
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

    describe("Virtual Scroll Style", () => {
      it("renders <ContentPlaceHolder /> for previous and next pages", () => {
        usingMount(
          <InfiniteScroll
            containerComponent={TestContainer}
            modelComponent={TestContainerModel}
            modelComponentProps={{ testModelProp: "testing model prop" }}
            query={{ page: 4 }}
            modelName={fakeService}
          />, wrapper => {
            expect(wrapper.find("ContentPlaceHolder")).to.have.lengthOf(2);
          },
        );
      });

      // TODO: Calculate height of ref? Test failing because currently HTML DOM is not being rendered in test so height of ref is 0
      describe("Scrolling Events", () => {
        it("loads new previous page when scrolling and previous page exists", async () => {
          await usingMount(
            <InfiniteScroll
              containerComponent={TestContainer}
              modelComponent={TestContainerModel}
              modelComponentProps={{ testModelProp: "testing model prop" }}
              query={{ page: 1 }}
              modelName={fakeService}
              debounceTime={debounceTime}
            />, wrapper => {
              return new Promise((resolve, reject) => {
                simulateScrollEvent(wrapper, "TestContainer", { target: { scrollTop: 500, clientHeight: 50, scrollHeight: 200 } });

                setTimeout(() => {
                  try {
                    wrapper.update();
                    expect(wrapper.find(".page4")).to.have.lengthOf(10);
                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                }, debounceTime + 100);
              });
            },
          );
        });

        it("loads expected page when scrolling", async () => {
          await usingMount(
            <InfiniteScroll
              containerComponent={TestContainer}
              modelComponent={TestContainerModel}
              modelComponentProps={{ testModelProp: "testing model prop" }}
              query={{ page: 1 }}
              modelName={fakeService}
              debounceTime={debounceTime}
            />, wrapper => {
              return new Promise((resolve, reject) => {
                simulateScrollEvent(wrapper, "TestContainer", { target: { scrollTop: 500, clientHeight: 50, scrollHeight: 200 } });

                setTimeout(() => {
                  try {
                    wrapper.update();
                    expect(wrapper.find(".page6")).to.have.lengthOf(10);
                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                }, debounceTime + 100);
              });
            },
          );
        });

        it("loads new next page when scrolling and next page exists", async () => {
          await usingMount(
            <InfiniteScroll
              containerComponent={TestContainer}
              modelComponent={TestContainerModel}
              modelComponentProps={{ testModelProp: "testing model prop" }}
              query={{ page: 1 }}
              modelName={fakeService}
              debounceTime={debounceTime}
            />, wrapper => {
              return new Promise((resolve, reject) => {
                simulateScrollEvent(wrapper, "TestContainer", { target: { scrollTop: 500, clientHeight: 50, scrollHeight: 200 } });

                setTimeout(() => {
                  try {
                    wrapper.update();
                    expect(wrapper.find(".page7")).to.have.lengthOf(10);
                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                }, debounceTime + 100);
              });
            },
          );
        });

        it("page load is unchanged when scrolling an amount less than page height", async () => {
          await usingMount(
            <InfiniteScroll
              containerComponent={TestContainer}
              modelComponent={TestContainerModel}
              modelComponentProps={{ testModelProp: "testing model prop" }}
              query={{ page: 1 }}
              modelName={fakeService}
              debounceTime={debounceTime}
            />, wrapper => {
              return new Promise((resolve, reject) => {
                expect(wrapper.find("TestContainerModel")).to.have.lengthOf(30); // verify page load before scrolling
                simulateScrollEvent(wrapper, "TestContainer", { target: { scrollTop: 50, clientHeight: 50, scrollHeight: 200 } });

                setTimeout(() => {
                  try {
                    wrapper.update();
                    expect(wrapper.find("TestContainerModel")).to.have.lengthOf(30); // verify pageload is unchanged
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
  });
});

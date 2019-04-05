// tslint:disable no-unused-expression
import * as React from "react";

import {
  fakeModelModule,
  getDataService,
  initializeTestServices,
  QueryBuilder,
  QueryManager,
  setTimeoutPromise
} from "redux-data-service";

import { of as of$ } from "rxjs/observable/of";

import { stub } from "sinon";
import { seedServiceListWithPagingOptions, simulateScrollEvent, usingMount } from "../TestUtils";
import "../TestUtils/TestSetup";

import { InfiniteScroll } from "./InfiniteScroll";

declare var intern;
const { beforeEach, describe, it } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("<InfiniteScroll />", () => {
  const TestContainer = (props) => {
    const style = {
      height: 250,
      width: 250,
      border: "solid 1px black",
      overflow: "auto",
    };

    return (
      <div style={style} {...props}>
        {props.children}
      </div>
    );
  };

  const testContainerModelStyle = {
    height: 20,
    padding: "15px",
    borderBottom: "solid 1px #999",
  };

  const TestContainerModel = ({ model }) => (
    <div style={testContainerModelStyle} className={model.fullText}>
      {model.fullText}
    </div>
  );

  let fakeService;
  let pageSize;
  let totalPages;
  let delayTimeout;

  beforeEach(() => {
    Error.stackTraceLimit = Infinity;

    fakeService = "fakeModel";
    pageSize = 10;
    totalPages = 10;
    delayTimeout = 200;

    initializeTestServices(fakeModelModule);
    seedServiceListWithPagingOptions(fakeService, pageSize, totalPages);
  });

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
        className="testing extra prop"
        modelComponent={TestContainerModel}
        query={{ page: 3 }}
        modelName={fakeService}
      />, wrapper =>
        expect(wrapper.find("TestContainer").prop("className")).to.equal("testing extra prop"),
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
        />, wrapper => new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              expect(wrapper.find(".page5")).to.have.lengthOf(pageSize);
              resolve();
            } catch (e) {
              reject(e);
            }
          }, delayTimeout + 100);
        }),
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
        />, wrapper => new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              expect(wrapper.find(".page4")).to.have.lengthOf(pageSize);
              resolve();
            } catch (e) {
              reject(e);
            }
          }, delayTimeout + 100);
        }),
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
        />, wrapper => new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              expect(wrapper.find(".page6")).to.have.lengthOf(pageSize);
              resolve();
            } catch (e) {
              reject(e);
            }
          }, delayTimeout + 100);
        }),
      );
    });

    describe("Infinite Scroll Style", () => {

      it("loads all previous pages", async () => {
        await usingMount(
          <InfiniteScroll
            containerComponent={TestContainer}
            modelComponent={TestContainerModel}
            modelComponentProps={{ testModelProp: "testing model prop" }}
            query={{ page: 5 }}
            modelName={fakeService}
            disableVirtualScrolling
          />, wrapper => setTimeoutPromise(() => {
            expect(wrapper.find(".page1")).to.have.lengthOf(pageSize);
            expect(wrapper.find(".page2")).to.have.lengthOf(pageSize);
            expect(wrapper.find(".page3")).to.have.lengthOf(pageSize);
            expect(wrapper.find(".page4")).to.have.lengthOf(pageSize);
          }),
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
              delayTimeout={delayTimeout}
            />, wrapper => {
              return new Promise((resolve, reject) => {
                simulateScrollEvent(wrapper, "TestContainer", {
                  target: {
                    scrollTop: 200,
                    clientHeight: 50,
                    scrollHeight: 200
                  }
                });

                setTimeout(() => {
                  try {
                    wrapper.update();
                    expect(wrapper.find("TestContainerModel")).to.have.lengthOf(50);
                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                }, delayTimeout + 100);
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
              delayTimeout={delayTimeout}
            />, wrapper => {
              return new Promise((resolve, reject) => {
                expect(wrapper.find("TestContainerModel")).to.have.lengthOf(100); // verify page load before scrolling
                simulateScrollEvent(wrapper, "TestContainer", {
                  target: {
                    scrollTop: 200,
                    clientHeight: 50,
                    scrollHeight: 200
                  }
                });

                setTimeout(() => {
                  try {
                    wrapper.update();
                    expect(wrapper.find("TestContainerModel")).to.have.lengthOf(100); // verify pageload is unchanged
                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                }, delayTimeout + 100);
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
              delayTimeout={delayTimeout}
            />, wrapper => {
              return new Promise((resolve, reject) => {
                expect(wrapper.find("TestContainerModel")).to.have.lengthOf(30); // verify page load before scrolling
                simulateScrollEvent(wrapper, "TestContainer", {
                  target: {
                    scrollTop: 100,
                    clientHeight: 50,
                    scrollHeight: 200
                  }
                });

                setTimeout(() => {
                  try {
                    wrapper.update();
                    expect(wrapper.find("TestContainerModel")).to.have.lengthOf(30); // verify pageload is unchanged
                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                }, delayTimeout + 100);
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
              delayTimeout={delayTimeout}
            />, wrapper => {
              return new Promise((resolve, reject) => {
                expect(wrapper.find("TestContainerModel")).to.have.lengthOf(30); // verify page load before scrolling
                simulateScrollEvent(wrapper, "TestContainer", {
                  target: {
                    scrollTop: 0,
                    clientHeight: 50,
                    scrollHeight: 200
                  }
                });

                setTimeout(() => {
                  try {
                    wrapper.update();
                    expect(wrapper.find("TestContainerModel")).to.have.lengthOf(30); // verify pageload is unchanged
                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                }, delayTimeout + 100);
              });
            },
          );
        });
      });
    });

    describe("Virtual Scroll Style", () => {
      let div;

      beforeEach(() => {
        // Attaching div to mount container in order to access client heights, otherwise the heights will be 0 and
        // tests will fail
        div = document.createElement("div");
        document.body.appendChild(div);
      });

      it("renders default <ContentPlaceHolder /> for previous and next pages", () => {
        usingMount(
          <InfiniteScroll
            containerComponent={TestContainer}
            modelComponent={TestContainerModel}
            modelComponentProps={{ testModelProp: "testing model prop" }}
            query={{ page: 4 }}
            modelName={fakeService}
          />, wrapper => {
            expect(wrapper.find("DefaultContentPlaceHolder")).to.have.lengthOf(2);
          },
        );
      });

      describe("Scrolling Events", () => {
        it("loads new previous page when scrolling and previous page exists", async () => {
          await usingMount(
            <InfiniteScroll
              containerComponent={TestContainer}
              modelComponent={TestContainerModel}
              modelComponentProps={{ testModelProp: "testing model prop" }}
              query={{ page: 1 }}
              modelName={fakeService}
              delayTimeout={delayTimeout}
            />, async wrapper => {

              await setTimeoutPromise(() => {
                wrapper.update();
                const amountToScrollToPage6 = 2600;
                simulateScrollEvent(wrapper, "TestContainer", {
                  target: { scrollTop: amountToScrollToPage6, clientHeight: 250, scrollHeight: 0 },
                });
              }, delayTimeout + 100);

              await setTimeoutPromise(() => {
                wrapper.update();
                expect(wrapper.find(".page5")).to.have.lengthOf(10);
              }, delayTimeout + 100);
            }, { attachTo: div },
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
              delayTimeout={delayTimeout}
            />, wrapper => {
              return new Promise((resolve, reject) => {
                const amountToScrollToPage6 = 2600;
                simulateScrollEvent(wrapper, "TestContainer", {
                  target: { scrollTop: amountToScrollToPage6, clientHeight: 250, scrollHeight: 0 },
                });

                setTimeout(() => {
                  try {
                    wrapper.update();
                    expect(wrapper.find(".page6")).to.have.lengthOf(10);
                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                }, delayTimeout + 100);
              });
            }, { attachTo: div },
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
              delayTimeout={delayTimeout}
            />, wrapper => {
              return new Promise((resolve, reject) => {
                const amountToScrollToPage6 = 2600;
                simulateScrollEvent(wrapper, "TestContainer", {
                  target: { scrollTop: amountToScrollToPage6, clientHeight: 250, scrollHeight: 0 },
                });

                setTimeout(() => {
                  try {
                    wrapper.update();
                    expect(wrapper.find(".page7")).to.have.lengthOf(10);
                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                }, delayTimeout + 100);
              });
            }, { attachTo: div },
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
              delayTimeout={delayTimeout}
            />, wrapper => {
              return new Promise((resolve, reject) => {

                // verify page load before scrolling
                expect(wrapper.find("TestContainerModel")).to.have.lengthOf(20);
                expect(wrapper.find(".page1")).to.have.lengthOf(10);
                expect(wrapper.find(".page2")).to.have.lengthOf(10);

                const amountToScrollToStayOnPage1 = 250;
                simulateScrollEvent(wrapper, "TestContainer", {
                  target: { scrollTop: amountToScrollToStayOnPage1, clientHeight: 250, scrollHeight: 0 },
                });

                setTimeout(() => {
                  try {
                    wrapper.update();

                    // verify page load is unchanged
                    expect(wrapper.find("TestContainerModel")).to.have.lengthOf(20);
                    expect(wrapper.find(".page1")).to.have.lengthOf(10);
                    expect(wrapper.find(".page2")).to.have.lengthOf(10);

                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                }, delayTimeout + 100);
              });
            }, { attachTo: div },
          );
        });

        it("should render the given contentPlaceHolderComponent if the initial query does not yet have a response", async () => {
          const service = getDataService(fakeService);
          const queryParams = { page: 1 };
          const queryBuilder = new QueryBuilder(fakeService, queryParams);

          const fakeQueryManager = new QueryManager(queryBuilder, []);

          stub(service, "getByQuery").returns(of$(fakeQueryManager));

          const FakeComponent = () => <span />;

          await usingMount(
            <InfiniteScroll
              contentPlaceHolderComponent={FakeComponent}
              containerComponent={TestContainer}
              modelComponent={TestContainerModel}
              modelComponentProps={{ testModelProp: "testing model prop" }}
              query={queryParams}
              modelName={fakeService}
              delayTimeout={delayTimeout}
            />, wrapper => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  try {
                    expect(
                      wrapper.find(FakeComponent).exists()
                    ).to.be.true;
                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                }, delayTimeout + 100);
              });
            }, { attachTo: div },
          );
        });
      });
    });
  });
});

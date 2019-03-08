// tslint:disable no-unused-expression
import * as React from "react";

import { spy } from "sinon";
import { usingMount } from "./TestUtils";
import "./TestUtils/TestSetup";

import { DELAY_TIMEOUT, withDelayedHandlers } from "./WithDelayedHandlers";
import { setTimeoutPromise } from "redux-data-service";

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
    })(({ onClick }) => <button onClick={onClick} />);
  });

  it("renders a component wrapped by withDelayedHandlers() HOC", () => {
    usingMount(
      <Component />,
      wrapper => expect(wrapper.find("button").exists()).to.be.true
    );
  });

  it("passes the callbacks to the wrapped component", () => {
    usingMount(
      <Component />,
      wrapper => expect(
        wrapper.find("button").prop("onClick")
      ).to.be.a("function")
    );
  });

  it(`throttles and debounces the callback over ${DELAY_TIMEOUT}ms by default`, async () => {
    await usingMount(
      <Component />,
      async wrapper => {
        wrapper.find("button").simulate("click");
        wrapper.find("button").simulate("click");

        // throttle calls it immediately then blocks calls until the given timeout has passed
        expect(delayedCallback.callCount).to.equal(1);

        await setTimeoutPromise(() => {
          // debounce calls it at the tail end after no more events have occurred for given timeout
          expect(delayedCallback.callCount).to.equal(3);
        }, DELAY_TIMEOUT + 50);
      }
    );
  });

  it("throttles and debounces the callback over given timeout period", async () => {
    const timeout = 500;

    await usingMount(
      <Component delayTimeout={timeout} />,
      async wrapper => {
        wrapper.find("button").simulate("click");
        wrapper.find("button").simulate("click");

        // throttle calls it immediately then blocks calls until the given timeout has passed
        expect(delayedCallback.callCount).to.equal(1);

        await setTimeoutPromise(() => {
          // debounce calls it at the tail end after no more events have occurred for given timeout
          expect(delayedCallback.callCount).to.equal(3);
        }, timeout + 50);
      }
    );
  });

  it("only throttles the callback when enableDebounce is false", async () => {
    await usingMount(
      <Component enableDebounce={false} />,
      async wrapper => {
        wrapper.find("button").simulate("click");
        wrapper.find("button").simulate("click");

        // throttle calls it immediately then blocks calls until the given timeout has passed
        expect(delayedCallback.callCount).to.equal(1);

        await setTimeoutPromise(() => {
          // if debounce were enabled, it would have called the callback a third time
          expect(delayedCallback.callCount).to.equal(2);
        }, DELAY_TIMEOUT + 50);
      }
    );
  });

  it("only debounces the callback when enableThrottle is false", async () => {
    await usingMount(
      <Component enableThrottle={false} />,
      async wrapper => {
        wrapper.find("button").simulate("click");
        wrapper.find("button").simulate("click");

        // if throttle were enabled, the callback would have been called once already
        expect(delayedCallback.callCount).to.equal(0);

        await setTimeoutPromise(() => {
          // debounce calls it at the tail end after no more events have occurred for given timeout
          expect(delayedCallback.callCount).to.equal(1);
        }, DELAY_TIMEOUT + 50);
      }
    );
  });

  it("neither throttles nor debounces the callback when both are false", async () => {
    await usingMount(
      <Component enableThrottle={false} enableDebounce={false} />,
      async wrapper => {
        wrapper.find("button").simulate("click");
        wrapper.find("button").simulate("click");

        // callback is called each time immediately when throttle and debounce are both disabled
        expect(delayedCallback.callCount).to.equal(2);

        await setTimeoutPromise(() => {
          // does not call any extra time
          expect(delayedCallback.callCount).to.equal(2);
        }, DELAY_TIMEOUT + 50);
      }
    );
  });

});

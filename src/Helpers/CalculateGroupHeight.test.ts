import "../TestUtils/TestSetup";

import { stub } from "sinon";
import { random } from "faker";
import { calculateGroupHeight } from "./CalculateGroupHeight";

declare var intern;
const { describe, it } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("calculateGroupHeight", () => {

  it("returns the number of pixels between the top of the first element and the bottom of the last element", () => {
    const top = random.number();
    const bottom = top + random.number();

    const firstElement = {
      getBoundingClientRect: stub().returns({ top })
    };

    const lastElement = {
      getBoundingClientRect: stub().returns({ bottom })
    };

    expect(calculateGroupHeight(firstElement, lastElement)).to.equal(bottom - top);
  });

});

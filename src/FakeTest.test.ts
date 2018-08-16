/* tslint:disable: no-unused-expression */

import { stub } from "sinon";

declare var intern;
const { describe, it } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("Fake Test", () => {

  it("fails the build", () => {
    expect(false).to.be.true;
  });

});

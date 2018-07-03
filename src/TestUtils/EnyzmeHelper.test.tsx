 // tslint:disable:no-unused-expression

import * as React from "react";

import "./TestSetup";
import { FakeComponent } from "./FakeComponent";
import { usingMount } from "./EnzymeHelper";

declare var intern;
const { describe, it } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("EnzymeHelper", () => {
  describe("usingMount", () => {
    it("mounts the component and runs the function", () => {
      let didRun = false;
      usingMount(<FakeComponent fakeProp="value" />, (wrapper) => {
        didRun = true;
        expect(wrapper.props()).to.deep.equal({fakeProp: "value"});
      });
      expect(didRun).to.be.true;
    });

    it("mounts an intrinsic element", () => {
      let didRun = false;
      usingMount(<span />, (wrapper) => {
        didRun = true;
        expect(wrapper).not.to.be.undefined;
      });
      expect(didRun).to.be.true;
    });

    it("wont cause an error if the whileMounted func unmounts the component", () => {
      let didRun = false;
      usingMount(<span />, (wrapper) => {
        didRun = true;
        wrapper.unmount();
      });
      expect(didRun).to.be.true;
      // intrinsically expect no exceptions thrown on explicit unmount from usingMount
    });

    it("throws any exceptions", () => {
      let didRun = false;
      expect( () =>
        usingMount(<span />, (wrapper) => {
          didRun = true;
          throw new Error("test");
        }),
      ).to.throw("test");
      expect(didRun).to.be.true;
    });
  });
});

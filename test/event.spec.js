const mocha      = require("mocha"),
      { expect } = require("chai"),
      mocks      = require("./mocks"),
      utils      = require("../utils/validators");

describe("Event", () => {

  it("should pass a `verified` event", () => {

    const result = utils.isValidEvent(mocks.validEvent);

    expect(result).to.be.true;
  });

  it("should fail an un-`verified` event", () => {

    const result = utils.isValidEvent(mocks.invalidEvent);

    expect(result).to.be.false;
  });

});

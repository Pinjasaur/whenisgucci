const mocha      = require("mocha"),
      { expect } = require("chai"),
      mocks      = require("./mocks"),
      utils      = require("../utils/index");

describe("Utils", () => {

  it("should trim and remove duplicate entries", () => {

    const result = utils.trimAndUnique(mocks.validInvitees);

    const expected = ["test@example.com"];
    expect(result).to.deep.equal(expected);
  });

  it("should trim and remove whitespace", () => {

    const result = utils.trimAndUnique(mocks.trimInvitees);

    const expected = ["test@example.com"];
    expect(result).to.deep.equal(expected);
  });

  it("should remove entries that are only whitespace", () => {

    const result = utils.trimAndUnique(mocks.whitespaceInvitees);

    const expected = [];
    expect(result).to.deep.equal(expected);
  });

});

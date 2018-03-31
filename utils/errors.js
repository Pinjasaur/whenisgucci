class TestError extends Error {
  constructor (msg, status = 400) {
    super();
    this.message = msg;
    this.status  = status;
    this.name    = "TestError";
  }
}

module.exports = {
  TestError
};

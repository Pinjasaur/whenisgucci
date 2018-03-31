// Wrapper to propagate errors (for use with async/await)
module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

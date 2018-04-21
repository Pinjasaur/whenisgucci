function trimAndUnique(arr) {

  return arr
    .map(i => i.trim()) // Trim whitespace
    .filter(i => i !== "") // No empties
    .filter((x, i, a) => a.indexOf(x) === i); // No duplicates;
}

module.exports = {
  trimAndUnique
};

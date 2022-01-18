/** @format */

const getInitial = (firstName, lastName) => {
  let result = "";
  if (firstName) {
    result += firstName[0];
  }
  if (lastName) {
    result += lastName[0];
  } else {
    if (firstName) {
      result += firstName[1];
    }
  }

  return result && result.toUpperCase();
};

module.exports = getInitial;

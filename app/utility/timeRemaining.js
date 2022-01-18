function isoToObj(s) {
  var b = s.split(/[-TZ:]/i);

  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5]));
}

function timeRemaining(s) {
  // Utility to add leading zero
  function z(n) {
    return (n < 10 ? "0" : "") + n;
  }

  // Convert string to date object
  var d = isoToObj(s);
  var diff = d - new Date();

  // Allow for previous times
  var sign = diff < 0 ? "-" : "";
  diff = Math.abs(diff);

  // Get time components
  var days = (diff / 3.6e6 / 24) % 24 | 0;
  var hours = (diff / 3.6e6) % 24 | 0;
  var mins = ((diff % 3.6e6) / 6e4) | 0;
  var secs = Math.round((diff % 6e4) / 1e3);

  // Return formatted string
  return sign + z(days) + ":" + z(hours) + ":" + z(mins) + ":" + z(secs);
}
export default timeRemaining;

export default function timeSince(date, short = false) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ` ${short ? "y" : "years"}`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ` ${short ? "m" : "months"}`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ` ${short ? "d" : "days"}`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ` ${short ? "h" : "hours"}`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ` ${short ? "m" : "minutes"}`;
  }
  return Math.floor(seconds) + ` ${short ? "s" : "seconds"}`;
}

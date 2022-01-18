export default function secondsToHms(s) {
  s = Number(s);
  const isLessThan1Min = s / 60 <= 1;
  const isGreaterThan1Min = s / 60 > 1;
  const isLessThan2Hours = s / 3600 < 2;
  const isGreaterThan2Hours = s / 3600 >= 2;
  const isLessThan1day = s / (3600 * 24) < 1;
  const isGreaterThan1day = s / (3600 * 24) >= 1;
  var d = Math.floor(s / (3600 * 24));
  var h = Math.floor(s / 3600);
  var m = Math.floor((s % 3600) / 60);

  if (isLessThan1Min) {
    return `${s}${s > 1 ? "secs" : "sec"}`.toString();
  }
  if (isGreaterThan1Min && isLessThan2Hours) {
    return `${m}${m > 1 ? "mins" : "min"}`.toString();
  }
  if (isGreaterThan2Hours && isLessThan1day) {
    return `${h}${h > 1 ? "hrs" : "hr"}`.toString();
  }
  if (isGreaterThan1day) {
    return `${d}${d > 1 ? "days" : "day"}`.toString();
  }
}

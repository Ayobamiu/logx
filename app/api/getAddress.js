import axios from "axios";

export const ipLookUp = async () => {
  const response = await axios.get("http://ip-api.com/json");
  return response;
};

export const getAddressV2 = async (key, latitude, longitude) => {
  const result = await axios
    .get(
      `http://api.positionstack.com/v1/reverse?access_key=${key}&query=${
        latitude + "," + longitude
      }`
    )
    .catch(() => {});
  const confidences = [];
  for (let index = 0; index < result.data.data.length; index++) {
    const data = result.data.data[index];
    confidences.push(data.confidence);
  }
  var max_of_array = Math.max.apply(Math, confidences);
  const target = result.data.data.find(
    (item) => item.confidence === max_of_array
  );
  return target;
};
export const getCountries = async (key, latitude, longitude) => {
  const result = await axios
    .get(`https://api.countrystatecity.in/v1/countries`, {
      headers: {
        "X-CSCAPI-KEY":
          "QzBObGZZM2x0bkpqb0ViNGZjSEJsazdMZGU1YTVhdmVYbzVlN3c1TQ==",
      },
    })
    .catch(() => {});

  return result?.data;
};
export const getStatesInountry = async (countryCode) => {
  const result = await axios
    .get(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`, {
      headers: {
        "X-CSCAPI-KEY":
          "QzBObGZZM2x0bkpqb0ViNGZjSEJsazdMZGU1YTVhdmVYbzVlN3c1TQ==",
      },
    })
    .catch(() => {});

  return result.data;
};
export const getCitiesInStates = async (countryCode, stateCode) => {
  const result = await axios
    .get(
      `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`,
      {
        headers: {
          "X-CSCAPI-KEY":
            "QzBObGZZM2x0bkpqb0ViNGZjSEJsazdMZGU1YTVhdmVYbzVlN3c1TQ==",
        },
      }
    )
    .catch(() => {});

  return result.data;
};

export const getAddress = async (latitude, longitude) => {
  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json?" +
      "latlng=" +
      latitude +
      "," +
      longitude +
      "&key=" +
      "AIzaSyB1csOH5VrhgTKeDNF19eSW00TWGlRlCqA"
  );

  const currentLocation =
    response.data &&
    response.data.results[0] &&
    response.data.results[0].formatted_address;

  const country =
    response.data &&
    response.data.results.find(
      (result) => result.types && result.types[0] === "country"
    ).formatted_address;
  const city =
    response.data &&
    response.data.results.find(
      (result) =>
        result.types && result.types[0] === "administrative_area_level_1"
    ).formatted_address;
  return { currentLocation, city, country };
};

// var x = document.getElementById("demo");

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else {
//     x.innerHTML = "Geolocation is not supported by this browser.";
//   }
// }

// function showPosition(position) {
//   x.innerHTML =
//     "Latitude: " +
//     position.coords.latitude +
//     "<br>Longitude: " +
//     position.coords.longitude;
// }

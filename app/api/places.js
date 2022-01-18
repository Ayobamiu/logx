/** @format */

import apiClient from "./client";
import storage from "../auth/storage";
import apiClientNoCache from "./clientNotCached";

const estimateTripCostAndDistance = async (formData) => {
  const token = await storage.getToken();
  let data = {};
  let err = false;
  try {
    const result = await apiClient.post("/trip/estimate", formData, {
      headers: {
        Authorization: token,
      },
    });
    data = result?.data?.error ? [] : result.data;
  } catch (error) {
    if (error !== "") {
      err = true;
    }
  }
  return { error: err, data };
};
const addTrip = async (formData) => {
  const token = await storage.getToken();
  let data = {};
  let err = false;
  try {
    const result = await apiClientNoCache.post("/trip", formData, {
      headers: {
        Authorization: token,
      },
    });
    data = result?.data?.error ? [] : result.data;
  } catch (error) {
    if (error !== "") {
      err = true;
    }
  }
  return { error: err, data };
};
const addTripBid = async (formData, tripId) => {
  const token = await storage.getToken();
  let data = {};
  let err = false;
  let errMessage = "";
  try {
    const result = await apiClientNoCache.post(
      `/trip-bid/${tripId}`,
      formData,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    data = result?.data?.error ? [] : result.data;
    if (result.error) {
      err = true;
      errMessage = result.message;
    }
  } catch (error) {
    if (error !== "") {
      err = true;
    }
  }
  return { error: err, data, errMessage };
};
const acceptRejectTrip = async (tripBidId, formData) => {
  let data = {};
  let err = false;
  try {
    const result = await apiClientNoCache.patch(
      `/trip-bid/accept-reject/${tripBidId}`,
      formData
    );
    data = result?.data?.error ? [] : result.data;
  } catch (error) {
    if (error !== "") {
      err = true;
    }
  }
  return { error: err, data };
};
const getTripBids = async (tripId) => {
  let data = {};
  let err = false;
  try {
    const result = await apiClientNoCache.get(`/trip-bid/${tripId}`);
    data = result?.data?.error ? [] : result.data;
  } catch (error) {
    if (error !== "") {
      err = true;
    }
  }
  return { error: err, data };
};
const getSingleTrip = async (tripId) => {
  let data = {};
  let err = false;
  try {
    const result = await apiClientNoCache.get(`/trip/${tripId}`);
    data = result?.data?.error ? [] : result.data;
  } catch (error) {
    if (error !== "") {
      err = true;
    }
  }
  return { error: err, data };
};
const changeTripStatus = async (tripId, formData) => {
  let data = {};
  let err = false;
  try {
    const result = await apiClientNoCache.patch(
      `/trip/change-status/${tripId}`,
      formData
    );
    data = result?.data?.error ? [] : result.data;
  } catch (error) {
    if (error !== "") {
      err = true;
    }
  }
  return { error: err, data };
};
const changeTripPackageStatus = async (tripId, packageId, formData) => {
  let data = {};
  let err = false;
  try {
    const result = await apiClientNoCache.patch(
      `/trip/change-package-status/${tripId}/${packageId}`,
      formData
    );
    data = result?.data?.error ? [] : result.data;
  } catch (error) {
    if (error !== "") {
      err = true;
    }
  }
  return { error: err, data };
};
const updateTrip = async (tripId, formData) => {
  let data = {};
  let err = false;
  try {
    const result = await apiClientNoCache.patch(
      `/trip/update-trip/${tripId}`,
      formData
    );
    data = result?.data?.error ? [] : result.data;
  } catch (error) {
    if (error !== "") {
      err = true;
    }
  }
  return { error: err, data };
};
const driverAcceptTrip = async (tripId, formData) => {
  let data = {};
  let err = false;
  let errMessage = "";

  try {
    const result = await apiClientNoCache.post(
      `/trip/driver-accept/${tripId}`,
      formData
    );
    data = result?.data?.error ? [] : result.data;
    if (result.error) {
      err = true;
      errMessage = result.message;
    }
  } catch (error) {
    if (error !== "") {
      err = true;
    }
  }
  return { error: err, data, errMessage };
};
const getMyTrip = async () => {
  const token = await storage.getToken();
  let data = {};
  let err = false;
  try {
    const result = await apiClientNoCache.get("/trip", {
      headers: {
        Authorization: token,
      },
    });
    data = result?.data?.error ? [] : result.data;
  } catch (error) {
    if (error !== "") {
      err = true;
    }
  }
  return { error: err, data };
};
const getAvailableTrips = async (latitude, longitude) => {
  let data = {};
  let err = false;
  try {
    const result = await apiClientNoCache.get(
      `/trip/available-trips?latitude=${Number(latitude)}&longitude=${Number(
        longitude
      )}`
    );
    data = result?.data?.error ? [] : result?.data;
  } catch (error) {
    if (error !== "") {
      err = true;
    }
  }
  return { error: err, data };
};

const placePrediction = (searchQuery) =>
  apiClientNoCache.post("/trip/predictions", { searchQuery });
const getLatAndLong = (placeId) =>
  apiClientNoCache.post("/trip/latlong", { placeId });

export default {
  placePrediction,
  estimateTripCostAndDistance,
  getLatAndLong,
  addTrip,
  getMyTrip,
  getAvailableTrips,
  getTripBids,
  acceptRejectTrip,
  getSingleTrip,
  changeTripStatus,
  updateTrip,
  addTripBid,
  driverAcceptTrip,
  changeTripPackageStatus,
};

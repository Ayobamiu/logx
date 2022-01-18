/** @format */

import storage from "../auth/storage";
import apiClientNoCache from "./clientNotCached";

const addTripChat = async (formData) => {
  const token = await storage.getToken();
  let data = {};
  let err = false;
  let errMessage = "";
  try {
    const result = await apiClientNoCache.post("/chat", formData, {
      headers: {
        Authorization: token,
      },
    });
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

const getTripChats = async (tripId) => {
  let data = {};
  let err = false;
  try {
    const result = await apiClientNoCache.get(`/chat/${tripId}`);
    data = result?.data?.error ? [] : result.data;
  } catch (error) {
    if (error !== "") {
      err = true;
    }
  }
  return { error: err, data };
};

export default {
  addTripChat,
  getTripChats,
};

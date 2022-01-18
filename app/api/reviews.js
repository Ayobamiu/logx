/** @format */

import storage from "../auth/storage";
import apiClientNoCache from "./clientNotCached";

const addReview = async (formData) => {
  const token = await storage.getToken();
  let data = {};
  let err = false;
  let errMessage = "";
  try {
    const result = await apiClientNoCache.post("/review", formData, {
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

const getMyReviews = async () => {
  const token = await storage.getToken();
  let data = {};
  let err = false;
  try {
    const result = await apiClientNoCache.get(`/review`, {
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

export default {
  addReview,
  getMyReviews,
};

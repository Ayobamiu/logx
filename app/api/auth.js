/** @format */

import apiClient from "./client";
import storage from "../auth/storage";
const { default: axios } = require("axios");

const login = (email, password) =>
  apiClient.post("/auth/login", { email, password });
const signUp = (data) => apiClient.post("/auth", { ...data });
const passordResetCode = (data) =>
  apiClient.post("/auth/password-reset-code", { ...data });
const verify = (data) => apiClient.post("/auth/verification-code", { ...data });
const verifyTrip = (data) => apiClient.post("/trip/trip-otp", { ...data });
const sendEndTripOTP = (data) =>
  apiClient.post("/trip/end-trip-otp", { ...data });
// const updateProfile = (data) => apiClient.patch("/auth", { ...data });

const changePassword = async (formData) => {
  const token = await storage.getToken();
  let data = {};
  let err = false;
  try {
    const result = await apiClient.post("/auth/change-password", formData, {
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
const updateProfile = async (formData) => {
  const token = await storage.getToken();
  let data = {};
  let err = false;
  try {
    const result = await apiClient.patch("/auth", formData, {
      headers: {
        Authorization: `${token}`,
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
const updateProfileMedia = async (formData) => {
  const token = await storage.getToken();

  let data = {};
  let err = false;
  try {
    const result = await apiClient.patch("/auth/update-media", formData, {
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
  login,
  signUp,
  updateProfile,
  updateProfileMedia,
  verify,
  verifyTrip,
  sendEndTripOTP,
  passordResetCode,
  changePassword,
};

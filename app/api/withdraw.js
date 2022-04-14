/** @format */

import axios from "axios";
import storage from "../auth/storage";
import apiClient from "./client";

const withdraw = async (data, onUploadProgress) => {
  const token = await storage.getToken();
  let user = null;
  let transaction = {};
  let err = false;

  try {
    const result = await axios.post(
      "withdraw",
      { ...data },
      {
        onUploadProgress: (progressEvent) => {
          onUploadProgress(progressEvent.loaded / progressEvent.total);
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    if (result.data) {
      transaction = result.data.transaction;
      user = result.data.user;
    }
  } catch (error) {
    err = true;
  }
};

export default {
  withdraw,
};

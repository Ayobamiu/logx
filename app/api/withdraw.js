/** @format */

import storage from "../auth/storage";
import apiClient from "./client";

const withdraw = async (data, onUploadProgress) => {
  const token = await storage.getToken();
  let transaction = {};
  let err = false;

  try {
    const result = await apiClient.post(
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
    transaction = result.data.transaction;
  } catch (error) {
    err = true;
  }
  return { transaction, error: err };
};

export default {
  withdraw,
};

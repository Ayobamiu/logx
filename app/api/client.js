/** @format */

const { default: axios } = require("axios");
const cache = require("../utility/cache");

import server from "./server";

const apiClient = axios.create({
  baseURL: server,
});

// const patch = apiClient.patch;
const post = apiClient.post;
const get = apiClient.get;

apiClient.post = async (url, data, config) => {
  try {
    const response = await post(url, data, config);
    return response;
  } catch (error) {
    if (error.response) {
      // Request made and server responded
      return { error: true, message: error.response.data.message };
    } else if (error.request) {
      // The request was made but no response was received
      return { error: true, message: "Try Again, Couldn't connect" };
    } else if (error.message) {
      // Something happened in setting up the request that triggered an Error
      return { error: true, message: error.message };
    } else {
      // Something happened in setting up the request that triggered an Error
      return { error: true, message: "Something is not right, Try again" };
    }
  }
};

apiClient.get = async (url, params, axiosConfig, cacheToStore = true) => {
  try {
    const response = await get(url, params, axiosConfig);
    if (response.status === 200) {
      if (cacheToStore) {
        await cache.store(url, response.data);
      }
      return response;
    }
  } catch (error) {
    const data = await cache.get(url);
    return data ? { status: 200, data } : error.response;
  }
};

export default apiClient;

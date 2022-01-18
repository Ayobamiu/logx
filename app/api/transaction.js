import apiClient from "./client";
import storage from "../auth/storage";
import apiClientNoCache from "./clientNotCached";

const addOrRemoveMoney = async (formData) => {
  const token = await storage.getToken();
  let data = {};
  let err = false;
  try {
    const result = await apiClientNoCache.post("/transaction", formData, {
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
const getMyTransactions = async () => {
  const token = await storage.getToken();
  let data = {};
  let err = false;
  try {
    const result = await apiClientNoCache.get("/transaction", {
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
export default {
  addOrRemoveMoney,
  getMyTransactions,
};

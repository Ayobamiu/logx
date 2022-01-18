import * as SecureStore from "expo-secure-store";
import jwt_decode from "jwt-decode";

const userKey = "user";
const key = "authToken";
async function storeAuthToken(authToken) {
  try {
    await SecureStore.setItemAsync(key, authToken);
    const user = jwt_decode(authToken).user;
    await storeUser(user);
  } catch (error) {
    console.warn("Error storing authToken", error);
  }
}
async function storeUser(user) {
  try {
    await SecureStore.setItemAsync(userKey, JSON.stringify(user));
  } catch (error) {
    console.warn("Error storing user", error);
  }
}

async function getToken() {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.warn("Error getting authToken");
  }
}
async function getUser() {
  const data = await SecureStore.getItemAsync(userKey);

  let user = null;
  if (data) {
    user = JSON.parse(data);
  }
  return user;
}

async function removeToken() {
  try {
    await SecureStore.deleteItemAsync(key);
    await SecureStore.deleteItemAsync(userKey);
  } catch (error) {
    console.warn("Error removing authToken");
  }
}

export default {
  storeAuthToken,
  getToken,
  removeToken,
  getUser,
  storeUser,
};

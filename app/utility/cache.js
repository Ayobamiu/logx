import AsyncStorage from "@react-native-async-storage/async-storage";

const expiryInMinutes = 5;
const store = async (key, value) => {
  try {
    const item = {
      value,
      timestamp: Date.now(),
    };
    const jsonValue = JSON.stringify(item);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

const isExpired = (item) => {
  const now = new Date();
  const storedTime = new Date(item.timestamp);
  const diff = Math.abs(now - storedTime);
  const minutes = Math.floor(diff / 1000 / 60);
  return minutes > expiryInMinutes;
};

const get = async (key) => {
  try {
    await getAllKeys();
    const jsonValue = await AsyncStorage.getItem(key);
    if (!jsonValue) return null;

    // if (isExpired(JSON.parse(jsonValue))) {
    //   await AsyncStorage.removeItem(key);
    //   return null;
    // }

    return JSON.parse(jsonValue).value;
  } catch (e) {
    // error reading value
  }
};

const getAllKeys = async () => {
  let keys = [];
  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    // read key error
  }

  // ['@MyApp_user', '@MyApp_key']
};

const clearAll = async () => {
  try {
    await getAllKeys();
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }
};

const remove = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
  }
};
export { store, get, clearAll, remove };

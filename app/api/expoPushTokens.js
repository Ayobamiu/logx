import storage from "../auth/storage";
import apiClient from "./client";
const register = async (expoPushToken) => {
  const token = await storage.getToken();
  apiClient.post(
    "/auth/expoPushToken",
    { expoPushToken },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export default { register };

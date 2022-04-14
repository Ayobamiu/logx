/** @format */

import SocketIOClient from "socket.io-client";
import server from "./server";
import * as Location from "expo-location";
import { notifyAboutNewTrip } from "../hooks/useNotification";
import storage from "../auth/storage";
// import useAuth from "../auth/useAuth";

let globalUser = null;

(async () => {
  const user = await storage.getUser();
  globalUser = user;
})();

export const usersList = [];
const socket = SocketIOClient(server, {
  transports: ["websocket"],
});

socket.on("driver:location", (data) => {});
socket.on("get_users_online", (users) => {
  for (const key in users) {
    if (users.hasOwnProperty(key)) {
      const user = users[key];
      const alreadyLoggedIn = usersList.findIndex(
        (i) => i.userId === user.userId
      );
      if (alreadyLoggedIn === -1) {
        usersList.push(user);
      } else {
        usersList.splice(alreadyLoggedIn, 1, user);
      }
    }
  }
});

socket.on("request:latlong", async (data) => {
  // if (data.id !== globalUser?._id) {
  //   notifyAboutNewTrip();
  // }
});

export default socket;

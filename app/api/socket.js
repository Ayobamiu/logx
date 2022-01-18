/** @format */

import SocketIOClient from "socket.io-client";
import server from "./server";
import * as Location from "expo-location";
import { notifyAboutNewTrip } from "../hooks/useNotification";

export const usersList = [];
const socket = SocketIOClient(server, {
  transports: ["websocket"],
});

socket.on("request:latlong", async (data) => {
  const location = await Location.getCurrentPositionAsync({});
  socket.emit("send:latlong", {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });
  notifyAboutNewTrip();
});

socket.on("driver:location", (data) => {
  console.log("data", data);
});
socket.on("get_users_online", (users) => {
  // console.log("now");
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

export default socket;

/** @format */

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import React, { useContext, useEffect, useState } from "react";
// import { getCountries } from "../api/getAddress";
import placeApi from "../api/places";
import authApi from "../api/auth";
import socket from "../api/socket";
import AuthContext from "../contexts/auth";
import useAuth from "../auth/useAuth";
import { get } from "../utility/cache";
import storage from "../auth/storage";

const useLocation = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [countries, setCountries] = useState([]);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }
      } catch (error) {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const userData = await storage.getUser();
      setUser(userData);
      const data = await getLocation();
      setLocation(data);
      await Location.setGoogleApiKey("AIzaSyCM5oYQQFY3p_RJ7T0_AfVQDt4hcTLhs-Y");

      const addressData = await Location.reverseGeocodeAsync({
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
      }).catch((error) => {
        // console.log("error", error);
      });
      setAddress(addressData && addressData[0]);
      await updateLastKnownLocation({
        location: {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
        },
      });
    })();
  }, []);

  const updateLastKnownLocation = async (data) => {
    await authApi.updateProfile(data);
  };
  const getPredictions = async (searchQuery) => {
    const result = await placeApi.placePrediction(searchQuery);
    return result;
  };

  const getLocation = async () => {
    const location = await Location.getCurrentPositionAsync({});
    return location;
  };

  Location.watchPositionAsync(
    { accuracy: Location.Accuracy.High },
    async (location) => {
      // console.log("Location has changed", {
      //   latitude: location?.coords?.latitude,
      //   longitude: location?.coords?.longitude,
      // });
      if (location && user) {
        socket.emit("driver:location:update", {
          location: {
            latitude: location?.coords?.latitude,
            longitude: location?.coords?.longitude,
          },
          userId: user?._id,
        });
        await updateLastKnownLocation({
          location: {
            latitude: location?.coords?.latitude,
            longitude: location?.coords?.longitude,
          },
        });
      }
    }
  );

  // const TASK_FETCH_LOCATION = "TASK_FETCH_LOCATION";

  // // 1 define the task passing its name and a callback that will be called whenever the location changes
  // TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data, error }) => {
  //   if (error) {
  //     console.error(error);
  //     return;
  //   }

  //   if (data) {
  //     const { locations } = data;
  //     let lat = locations[0].coords.latitude;
  //     let long = locations[0].coords.longitude;

  //     console.log(`${new Date(Date.now()).toLocaleString()}: ${lat},${long}`);
  //     socket.emit("driver:location", { ...locations[0] });
  //   }
  // });

  // // 2 start the task
  // Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
  //   accuracy: Location.Accuracy.Highest,
  //   // distanceInterval: 0, // minimum change (in meters) betweens updates
  //   distanceInterval: 1, // minimum change (in meters) betweens updates
  //   deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
  //   // foregroundService is how you get the task to be updated as often as would be if the app was open
  //   timeInterval: 1000,
  //   foregroundService: {
  //     notificationTitle: "Using your location",
  //     notificationBody:
  //       "To turn off, go back to the app and switch something off.",
  //   },
  // });

  // // 3 when you're done, stop it
  // Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
  //   if (value) {
  //     Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
  //   }
  // });

  return { getLocation, location, address };
};
export default useLocation;

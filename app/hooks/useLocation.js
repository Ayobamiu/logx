/** @format */

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import React, { useEffect, useState } from "react";
// import { getCountries } from "../api/getAddress";
import placeApi from "../api/places";
import authApi from "../api/auth";
import socket from "../api/socket";
import Geolocation from "react-native-geolocation-service";

const useLocation = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [countries, setCountries] = useState([]);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        // await Location.requestBackgroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        if (status !== "granted") {
          Geolocation.getCurrentPosition(
            (position) => {
              console.log("position", position);
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        }
      } catch (error) {}
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const data = await getLocation();
      setLocation(data);
      await Location.setGoogleApiKey("AIzaSyD7EBl1UGH5xBqR7ChqQkpw3_DXKKFjOV4");

      const addressData = await Location.reverseGeocodeAsync({
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
      }).catch((error) => {
        console.log("error", error);
      });
      setAddress(addressData[0]);
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
    (location) => {
      socket.emit("driver:location", { ...location });
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

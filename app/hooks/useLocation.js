/** @format */

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import React, { useContext, useEffect, useState } from "react";
// import { getCountries } from "../api/getAddress";
import placeApi from "../api/places";
import authApi from "../api/auth";
import socket from "../api/socket";
import storage from "../auth/storage";
import showToast from "../config/showToast";

const useLocation = () => {
  let locationSubscription = null;
  let mounted = true;

  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await Location.setGoogleApiKey(
          "AIzaSyCM5oYQQFY3p_RJ7T0_AfVQDt4hcTLhs-Y"
        );

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          getRecentPos();
        }
        if (status !== "granted") {
          showToast("Permission to access location was denied");
          if (mounted) {
            setErrorMsg("Permission to access location was denied");
          }
          return;
        }
      } catch (error) {}
    })();

    return () => {
      locationSubscription?.remove();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const userData = await storage.getUser();
      if (mounted) {
        setUser(userData);
      }
      const data = await getLocation();
      if (mounted) {
        setLocation(data);
      }

      const addressData = await Location.reverseGeocodeAsync({
        latitude: data?.coords?.latitude,
        longitude: data?.coords?.longitude,
      }).catch((error) => {});
      if (mounted) {
        setAddress(addressData && addressData[0]);
      }
      await updateLastKnownLocation({
        location: {
          latitude: data?.coords?.latitude,
          longitude: data?.coords?.longitude,
        },
      });
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const updateLastKnownLocation = async (data) => {
    await authApi.updateProfile(data);
  };
  const getPredictions = async (searchQuery) => {
    const result = await placeApi.placePrediction(searchQuery);
    return result;
  };

  const getLocation = async () => {
    let location = null;
    try {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 10000,
        timeout: 5000,
      });
    } catch (error) {
      showToast("Enable Location to use Location services.");
    }
    return location;
  };
  const getLastLocation = async () => {
    let location = null;
    try {
      location = await Location.getLastKnownPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 10000,
        timeout: 5000,
      });
    } catch (error) {
      showToast("Enable Location to use Location services.");
    }
    return location;
  };

  const getAddressFromLatLong = async (lat, long) => {
    const addressData = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: long,
    }).catch((error) => {});

    const location = addressData && addressData[0];
    return location;
  };

  const getRecentPos = async () => {
    locationSubscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High },
      async (location) => {
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
  };

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

  return {
    getLocation,
    location,
    address,
    getAddressFromLatLong,
    getLastLocation,
  };
};
export default useLocation;

/** @format */

import { useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import placesApi from "../api/places";
import socket from "../api/socket";
import showToast from "../config/showToast";
import AuthContext from "../contexts/auth";
import TripRequestsContext from "../contexts/tripRequests";
import { getDistanceFromLatLonInKm } from "../utility/latLong";
import useLocation from "./useLocation";

const useTrips = () => {
  const [acceptingTrip, setAcceptingTrip] = useState(false);
  const { tripRequests, setTripRequests } = useContext(TripRequestsContext);
  const { user } = useContext(AuthContext);
  const [loadingtrips, setLoadingtrips] = useState(false);

  let mounted = true;
  useEffect(() => {
    loadTrips();
    return () => {
      // setLoadingtrips(false);
      mounted = false;
    };
  }, []);
  const { getLocation } = useLocation();

  socket.on("trip:created", () => {
    loadTrips();
  });

  const loadTrips = async () => {
    const locationData = await getLocation();
    if (mounted) {
      setLoadingtrips(true);
    }
    const { data, error } = await placesApi.getAvailableTrips(
      locationData?.coords?.latitude,
      locationData?.coords?.longitude
    );

    if (!error && data) {
      const closeTrips = data.filter(
        (trip) => trip.sender?._id !== user._id && trip.distance <= 30000
      );
      if (mounted) {
        setTripRequests(closeTrips);
      }
    }
    if (mounted) {
      setLoadingtrips(false);
    }
  };

  const driverAcceptTrip = async (tripId, driverId) => {
    setAcceptingTrip(true);
    const { data, error, errMessage } = await placesApi.driverAcceptTrip(
      { driverId },
      tripId
    );
    setAcceptingTrip(false);
    if (error) {
      if (errMessage) {
        showToast(errMessage);
      } else {
        showToast("Error accepting trip.");
      }
    }
    if (!error && data) {
      showToast("Trip accepted successfully!");
    }
  };
  return { driverAcceptTrip, acceptingTrip, loadTrips, loadingtrips };
};
export default useTrips;

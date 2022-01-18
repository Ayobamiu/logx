/** @format */

import { useContext, useEffect, useState } from "react";
import placesApi from "../api/places";
import socket from "../api/socket";
import showToast from "../config/showToast";
import TripRequestsContext from "../contexts/tripRequests";
import { getDistanceFromLatLonInKm } from "../utility/latLong";
import useLocation from "./useLocation";

const useTrips = () => {
  const [acceptingTrip, setAcceptingTrip] = useState(false);
  const { tripRequests, setTripRequests } = useContext(TripRequestsContext);
  const [loadingtrips, setLoadingtrips] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);
  const { getLocation } = useLocation();

  socket.on("trip:created", () => {
    loadTrips();
  });
  const loadTrips = async () => {
    const locationData = await getLocation();
    setLoadingtrips(true);
    const { data, error } = await placesApi.getAvailableTrips(
      locationData?.coords?.latitude,
      locationData?.coords?.longitude
    );
    if (!error && data) {
      const closeTrips = data.filter(
        (trip) =>
          getDistanceFromLatLonInKm(
            trip.packages[0]?.pickUpAddressLat,
            trip.packages[0]?.pickUpAddressLong,
            locationData?.coords?.latitude,
            locationData?.coords?.longitude
          ) < 100000
      );
      setTripRequests(closeTrips);
    }
    setLoadingtrips(false);
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

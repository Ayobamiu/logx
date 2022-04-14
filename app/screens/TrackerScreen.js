/** @format */

import React, { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import * as Location from "expo-location";

import MapView, {
  Marker,
  AnimatedRegion,
  MarkerAnimated,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import colors from "../config/colors";
import socket from "../api/socket";
import showToast from "../config/showToast";
import placesApi from "../api/places";
import authApi from "../api/auth";
import AuthContext from "../contexts/auth";
import { usePubNub } from "pubnub-react";
import TripsContext from "../contexts/trips";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const defaultLatitude = 6.596724344423596;
const defaultLongitude = 3.4280451759727932;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
function Tracker({
  packages = [],
  tripId = "61f287a4ea74743ea7f2b172",
  onDriverLocationChange = () => {},
}) {
  let mounted = useRef(true);
  let locationSubscription = null;

  const pubnub = usePubNub();

  useEffect(() => {
    const listener = {
      message: (envelope) => {
        // updateLocationOfDriver(envelope.message.location);
        if (Platform.OS === "android") {
          if (animatedMarker.current && mounted.current) {
            animatedMarker.current.animateMarkerToCoordinate(
              {
                latitude: envelope?.message?.latitude,
                longitude: envelope?.message?.longitude,
              },
              duration
            );
          }
        } else {
          if (mounted.current) {
            driverLocation2
              ?.timing({
                latitude: envelope?.message?.latitude,
                longitude: envelope?.message?.longitude,
                useNativeDriver: true, // defaults to false if not passed explicitly
                duration,
              })
              .start();
          }
        }
      },
    };
    if (pubnub) {
      pubnub.addListener(listener);
      pubnub.subscribe({ channels: [`location`] });
    }

    return () => {
      pubnub.removeListener(listener);
      pubnub.unsubscribeAll();
      mounted.current = false;
    };
  }, [pubnub]);

  // const getRecentPos = async () => {
  //   const duration = 500;
  //   locationSubscription = await Location.watchPositionAsync(
  //     { accuracy: Location.Accuracy.High, distanceInterval: 1 },
  //     (location) => {
  //       if (Platform.OS === "android") {
  //         if (animatedMarker.current && mounted.current) {
  //           animatedMarker.current.animateMarkerToCoordinate(
  //             {
  //               latitude: location?.coords?.latitude,
  //               longitude: location?.coords?.longitude,
  //             },
  //             duration
  //           );
  //         }
  //       } else {
  //         if (mounted.current) {
  //           driverLocation2
  //             ?.timing({
  //               latitude: location?.coords?.latitude,
  //               longitude: location?.coords?.longitude,
  //               useNativeDriver: true, // defaults to false if not passed explicitly
  //               duration,
  //             })
  //             .start();
  //         }
  //       }
  //       if (mounted.current) {
  //         setLatitude(location?.coords?.latitude);
  //         setLongitude(location?.coords?.longitude);
  //       }
  //       // setdriverLocation2(
  //       //   new AnimatedRegion({
  //       //     latitude: location?.coords?.latitude,
  //       //     longitude: location?.coords?.longitude,
  //       //     latitudeDelta,
  //       //     longitudeDelta,
  //       //   })
  //       // );
  //     }
  //   );
  // };

  const latitudeDelta = LATITUDE_DELTA;
  const longitudeDelta = LONGITUDE_DELTA;
  const [latitude, setLatitude] = useState(defaultLatitude);
  const [longitude, setLongitude] = useState(defaultLongitude);

  const animatedMarker = useRef();
  const [driverLocation2, setdriverLocation2] = useState(
    new AnimatedRegion({
      latitude: defaultLatitude,
      longitude: defaultLongitude,
      latitudeDelta,
      longitudeDelta,
    })
  );

  const getMapRegion = () =>
    new AnimatedRegion({
      latitude,
      longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  return (
    <MapView.Animated
      region={getMapRegion()}
      style={styles.map}
      loadingEnabled={true}
      showsUserLocation={true}>
      {driverLocation2 && (
        <MarkerAnimated
          ref={animatedMarker}
          coordinate={driverLocation2}
          pinColor={colors.danger}></MarkerAnimated>
      )}
    </MapView.Animated>
  );
}
const styles = StyleSheet.create({
  container: {},
  map: { width: "100%", height: "100%" },
});
export default Tracker;

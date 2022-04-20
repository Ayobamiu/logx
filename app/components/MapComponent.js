/** @format */

import React, { useContext, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import * as Location from "expo-location";

import MapView, {
  Marker,
  AnimatedRegion,
  MarkerAnimated,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import colors from "../config/colors";
import showToast from "../config/showToast";
import placesApi from "../api/places";
import authApi from "../api/auth";
import AuthContext from "../contexts/auth";
import { usePubNub } from "pubnub-react";
import TripsContext from "../contexts/trips";

function MapComponent({ packages, tripId, onDriverLocationChange = () => {} }) {
  let mounted = useRef(true);
  let locationSubscription = null;
  const [errorMsg, setErrorMsg] = useState(null);
  const { user } = useContext(AuthContext);
  const { trips } = useContext(TripsContext);
  const pubnub = usePubNub();

  const tripsIAmDelivering = trips.filter((i) => i.driver?._id === user._id);
  useEffect(() => {
    mounted.current = true;
    const listener = {
      message: (envelope) => {
        updateLocationOfDriver(envelope.message.location);
      },
    };
    if (pubnub) {
      pubnub.subscribe({
        channels: [`location:${tripId}`],
        withPresence: true,
      });
      pubnub.addListener(listener);
    }

    return () => {
      pubnub.removeListener(listener);
      pubnub.unsubscribeAll();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          getRecentPos();
        }
        if (status !== "granted") {
          if (mounted.current) {
            setErrorMsg("Permission to access location was denied");
          }
          return;
        }
      } catch (error) {}
    })();

    return () => {
      locationSubscription?.remove();
      mounted.current = false;
    };
  }, []);
  const packageOne = packages[0];
  const [driverLocation, setDriverLocation] = useState();

  const latitudeDelta = 0.09;
  const longitudeDelta = 0.05;
  const getDriverLocation = async () => {
    const { data, error } = await placesApi.getDriverLocation(tripId);
    if (!error && data) {
      if (data?.location?.latitude && data?.location?.longitude) {
        if (mounted.current) {
          onDriverLocationChange({
            latitude: data?.location?.latitude,
            longitude: data?.location?.longitude,
          });
          setDriverLocation({
            latitude: data?.location?.latitude,
            longitude: data?.location?.longitude,
            latitudeDelta,
            longitudeDelta,
          });
          setdriverLocation2(
            new AnimatedRegion({
              latitude: data?.location?.latitude,
              longitude: data?.location?.longitude,
              latitudeDelta,
              longitudeDelta,
            })
          );
          setRegion(
            new AnimatedRegion({
              latitude: data?.location?.latitude,
              longitude: data?.location?.longitude,
              latitudeDelta,
              longitudeDelta,
            })
          );
        }
      }
    }
  };
  useEffect(() => {
    getDriverLocation();
    return () => {
      mounted.current = false;
    };
  }, []);
  const animatedMarker = useRef();
  const [driverLocation2, setdriverLocation2] = useState(null);
  const [region, setRegion] = useState(
    driverLocation
      ? new AnimatedRegion(driverLocation)
      : new AnimatedRegion({
          latitude: Number(packageOne?.pickUpAddressLat),
          longitude: Number(packageOne?.pickUpAddressLong),
          latitudeDelta,
          longitudeDelta,
        })
  );

  const updateLastKnownLocation = async (data) => {
    await authApi.updateProfile(data);
  };
  const getRecentPos = async () => {
    locationSubscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High },
      async (location) => {
        if (location && user) {
          tripsIAmDelivering.forEach((item) => {
            const message = {
              location: {
                latitude: location?.coords?.latitude,
                longitude: location?.coords?.longitude,
              },
              userId: user?._id,
              tripId: item._id,
            };
            pubnub
              .publish({ channel: `location:${item._id}`, message })
              .then((resp) => {});
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

  const updateLocationOfDriver = (data) => {
    const duration = 500;

    if (data && data.latitude !== driverLocation2?.latitude) {
      if (Platform.OS === "android") {
        if (animatedMarker.current && mounted.current) {
          animatedMarker.current.animateMarkerToCoordinate(
            { latitude: data.latitude, longitude: data.longitude },
            duration
          );
        }
      } else {
        if (mounted.current) {
          driverLocation2
            ?.timing({
              latitude: data.latitude,
              longitude: data.longitude,
              useNativeDriver: true, // defaults to false if not passed explicitly
              duration,
            })
            .start();
        }
      }
      if (mounted.current) {
        onDriverLocationChange({
          latitude: data?.latitude,
          longitude: data?.longitude,
        });
        setdriverLocation2(
          new AnimatedRegion({
            latitude: data?.latitude,
            longitude: data?.longitude,
            latitudeDelta,
            longitudeDelta,
          })
        );
        setRegion(
          new AnimatedRegion({
            latitude: data?.latitude,
            longitude: data?.longitude,
            latitudeDelta,
            longitudeDelta,
          })
        );
      }
    }
  };

  return (
    <MapView.Animated
      region={region}
      style={styles.map}
      loadingEnabled={true}
      showsUserLocation={true}
    >
      {driverLocation2 &&
        driverLocation2.latitude &&
        driverLocation2.longitude && (
          <MarkerAnimated
            ref={animatedMarker}
            coordinate={driverLocation2}
            pinColor={colors.danger}
          >
            {/* <MaterialCommunityIcons name='taxi' size={34} color='black' /> */}
          </MarkerAnimated>
        )}
      {driverLocation &&
        driverLocation.latitude &&
        driverLocation.longitude &&
        packages.map((item, index) => (
          <MapViewDirections
            key={index}
            lineDashPattern={[0]}
            destination={{
              latitude: Number(driverLocation.latitude),
              longitude: Number(driverLocation.longitude),
            }}
            origin={`place_id:${item.pickUpAddressPlaceId}`}
            apikey="AIzaSyAPHNQTmBHXh6-lJaWmIMFbRikrrkncssk"
            mode="DRIVING"
            timePrecision="now"
            strokeWidth={3}
            strokeColor="red"
            tappable
            onError={() => {
              showToast(
                "This route is plied by Airlines. We don't deliver by Air."
              );
            }}
          />
        ))}
      {driverLocation &&
        driverLocation.latitude &&
        driverLocation.longitude &&
        packages.map((item, index) => (
          <MapViewDirections
            key={index}
            lineDashPattern={[0]}
            origin={{
              latitude: Number(driverLocation.latitude),
              longitude: Number(driverLocation.longitude),
            }}
            destination={`place_id:${item.deliveryAddressPlaceId}`}
            apikey="AIzaSyAPHNQTmBHXh6-lJaWmIMFbRikrrkncssk"
            mode="DRIVING"
            timePrecision="now"
            strokeWidth={3}
            strokeColor="blue"
            tappable
            onError={() => {
              showToast(
                "This route is plied by Airlines. We don't deliver by Air."
              );
            }}
          />
        ))}
      {packages.map((item, index) => (
        <MapViewDirections
          lineDashPattern={[0]}
          key={index}
          origin={`place_id:${item.pickUpAddressPlaceId}`}
          destination={`place_id:${item.deliveryAddressPlaceId}`}
          apikey="AIzaSyAPHNQTmBHXh6-lJaWmIMFbRikrrkncssk"
          mode="DRIVING"
          timePrecision="now"
          strokeWidth={3}
          strokeColor="hotpink"
          tappable
          onError={() => {
            showToast(
              "This route is plied by Airlines. We don't deliver by Air."
            );
          }}
        />
      ))}

      {packages.map((item, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: Number(item.deliveryAddressLat),
            longitude: Number(item.deliveryAddressLong),
          }}
          title={`Delivery Location ${index + 1}`}
          description={item.deliveryAddress}
          pinColor={colors.primary}
        >
          {/* <Ionicons name='location' color={colors.primary} size={25} /> */}
        </Marker>
      ))}
      {packages.map((item, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: Number(item.pickUpAddressLat),
            longitude: Number(item.pickUpAddressLong),
          }}
          title={`Pick Up Point ${index + 1}`}
          description={item.pickUpAddress}
          pinColor={colors.primary}
        >
          {/* <Ionicons name='location' color={colors.primary} size={25} /> */}
        </Marker>
      ))}

      {/* <View
        style={{
          position: "absolute",
          minHeight: 20,
          width: 150,
          backgroundColor: colors.white,
          right: 10,
          top: 10,
          borderRadius: 20,
          padding: 3,
        }}>
        <AppText size='x-small'>Driver is 10 mins away</AppText>
      </View> */}
    </MapView.Animated>
  );
}
const styles = StyleSheet.create({
  container: {},
  map: { width: "100%", height: "100%" },
});
export default MapComponent;

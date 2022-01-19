/** @format */

import React, { useRef, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import MapView, {
  Marker,
  AnimatedRegion,
  MarkerAnimated,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import socket from "../api/socket";
import showToast from "../config/showToast";

function MapComponent({ driverLocation, packages }) {
  const packageOne = packages[0];
  const animatedMarker = useRef();
  const [driverLocation2, setdriverLocation2] = useState(
    new AnimatedRegion(driverLocation)
  );
  socket.on("location:driver", (data) => {
    const duration = 500;
    if (data && data.latitude !== driverLocation2.latitude) {
      if (Platform.OS === "android") {
        if (animatedMarker) {
          animatedMarker.animateMarkerToCoordinate(
            { latitude: data.latitude, longitude: data.longitude },
            duration
          );
        }
      } else {
        driverLocation2
          .timing({
            latitude: data.latitude,
            longitude: data.longitude,
            useNativeDriver: true, // defaults to false if not passed explicitly
            duration,
          })
          .start();
      }
    }
  });

  return (
    <MapView
      initialRegion={{
        latitude: Number(packageOne?.pickUpAddressLat),
        longitude: Number(packageOne?.pickUpAddressLong),
        latitudeDelta: 0.0622,
        longitudeDelta: 0.121,
      }}
      style={styles.map}
      loadingEnabled={true}
      showsUserLocation={true}>
      {driverLocation && (
        <MarkerAnimated
          ref={animatedMarker}
          coordinate={{
            latitude: Number(driverLocation?.latitude),
            longitude: Number(driverLocation?.longitude),
          }}>
          <MaterialCommunityIcons name='taxi' size={24} color='black' />
        </MarkerAnimated>
      )}
      {packages.map((item, index) => (
        <MapViewDirections
          key={index}
          origin={`place_id:${item.pickUpAddressPlaceId}`}
          destination={`place_id:${item.deliveryAddressPlaceId}`}
          apikey='AIzaSyCM5oYQQFY3p_RJ7T0_AfVQDt4hcTLhs-Y'
          mode='DRIVING'
          timePrecision='now'
          strokeWidth={3}
          strokeColor='hotpink'
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
          pinColor={colors.primary}>
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
          pinColor={colors.primary}>
          {/* <Ionicons name='location' color={colors.primary} size={25} /> */}
        </Marker>
      ))}
    </MapView>
  );
}
const styles = StyleSheet.create({
  container: {},
  map: { width: "100%", height: "100%" },
});
export default MapComponent;

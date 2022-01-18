/** @format */

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import colors from "../config/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AppText from "../components/AppText";
import AvailableUserItem from "../components/AvailableUserItem";
import useLocation from "../hooks/useLocation";
import MapView, { Marker, Polyline } from "react-native-maps";
import TripContext from "../contexts/trip";
import AppButton from "../components/AppButton";
import MapLabel from "../components/MapLabel";
import placesApi from "../api/places";
import BidResponseItem from "../components/BidResponseItem";
import { usersList } from "../api/socket";
import { getDistanceFromLatLonInKm } from "../utility/latLong";

function AvailableDrivers(props) {
  const { getLocation, location } = useLocation();
  const usersWithDistance = usersList.map((i) => {
    return {
      ...i,
      distance: getDistanceFromLatLonInKm(
        location?.coords?.latitude,
        location?.coords?.longitude,
        i.latitude,
        i.longitude
      ),
    };
  });
  const [loadingTripBids, setLoadingTripBids] = useState(false);
  const [showBids, setShowBids] = useState(false);
  const [bids, setBids] = useState([]);
  const [processingBid, setProcessingBid] = useState({
    id: "",
    loading: false,
    action: "",
  });

  const { trip, setTrip } = useContext(TripContext);
  const loadTriBids = async () => {
    setLoadingTripBids(true);

    const { data, error } = await placesApi.getTripBids(trip._id);
    if (!error && data) {
      setBids(data);
    }
    setLoadingTripBids(false);
  };

  const acceptRejectBid = async (id, status) => {
    setProcessingBid({
      id,
      loading: true,
      action: status,
    });

    const { data, error } = await placesApi.acceptRejectTrip(id, { status });
    setProcessingBid({
      id: "",
      loading: false,
      action: "",
    });
    if (!error && data) {
      setTrip(data);
      loadTriBids();
    }
  };

  const [packageOne, setPackageOne] = useState(trip && trip.packages[0]);

  const [region, setRegion] = useState({
    latitude: 8.9233587,
    longitude: -0.3674603,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    loadTriBids();
  }, []);

  useEffect(() => {
    (async () => {
      const data = await getLocation();
      setRegion({
        latitude: data?.coords?.latitude,
        longitude: data?.coords?.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const polylineCoordinates = [];
  trip.packages.forEach((packageItem) => {
    polylineCoordinates.push({
      latitude: Number(packageItem.deliveryAddressLat),
      longitude: Number(packageItem.deliveryAddressLong),
    });
    polylineCoordinates.push({
      latitude: Number(packageItem.pickUpAddressLat),
      longitude: Number(packageItem.pickUpAddressLong),
    });
  });
  const height = Dimensions.get("screen").height;
  if (!packageOne || packageOne === undefined) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <View>
          <MaterialIcons name='error-outline' size={100} color='black' />
        </View>
        <AppText style={{ marginVertical: 16 }}>
          Error Loading Trip Details
        </AppText>
        <AppButton
          title='Go Back'
          onPress={() => props.navigation.navigate("Home")}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={[styles.mapBox, { height: height * 0.6 }]}>
        <Pressable
          onPress={() => props.navigation.navigate("Home")}
          style={styles.backButton}>
          <Ionicons name='arrow-back' size={20} />
        </Pressable>
        <Pressable
          onPress={() => setShowBids(!showBids)}
          style={styles.bidButton}>
          <AppText>{showBids ? "Hide" : "Show"} bids</AppText>
        </Pressable>

        {showBids && (
          <View style={styles.bidsBox}>
            <FlatList
              data={bids.slice(0, 5)}
              ListEmptyComponent={
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    height: Dimensions.get("screen").height * 0.55,
                  }}>
                  <ActivityIndicator animating={loadingTripBids} />
                  {!loadingTripBids && (
                    <AppText style={{ color: colors.white }}>
                      No Bids for this trip
                    </AppText>
                  )}
                </View>
              }
              renderItem={({ item }) => (
                <BidResponseItem
                  bidItem={item}
                  onAccept={() => setAcceptBid(true)}
                  onAccept={() => acceptRejectBid(item._id, "accepted")}
                  onReject={() => acceptRejectBid(item._id, "rejected")}
                  loadingAccept={
                    processingBid.id === item._id &&
                    processingBid.action === "accepted" &&
                    processingBid.loading
                  }
                  loadingReject={
                    processingBid.id === item._id &&
                    processingBid.action === "rejected" &&
                    processingBid.loading
                  }
                  disableButtons={processingBid.loading}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}

        <MapView
          region={{
            ...region,
            latitude: Number(packageOne.deliveryAddressLat),
            longitude: Number(packageOne.deliveryAddressLong),
          }}
          style={styles.map}
          // showsTraffic={true}
          // showsCompass={true}
          onRegionChange={() => setRegion(region)}
          loadingEnabled={true}
          showsUserLocation={true}>
          {packageOne && (
            <Polyline
              lineDashPattern={[0]}
              coordinates={polylineCoordinates}
              strokeColor='#000' // fallback for when `strokeColors` is not supported by the map-provider
              strokeColors={[colors.primary]}
              strokeWidth={6}
            />
          )}

          {trip.packages.map((item, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: Number(item.deliveryAddressLat),
                longitude: Number(item.deliveryAddressLong),
              }}
              title={`Delivery Location ${index + 1}`}
              description={`Delivery Location ${index + 1}`}
              pinColor={colors.primary}>
              <MapLabel text={item.deliveryAddress} />
            </Marker>
          ))}
          {trip.packages.map((item, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: Number(item.pickUpAddressLat),
                longitude: Number(item.pickUpAddressLong),
              }}
              title={`Pick Up Point ${index + 1}`}
              description={`Pick Up Point ${index + 1}`}
              pinColor={colors.primary}>
              <MapLabel text={item.pickUpAddress} />
            </Marker>
          ))}
        </MapView>
      </View>
      <ScrollView
        style={[styles.usersBox, { height: height * 0.4 }]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            marginBottom: 30,
          }}>
          <Pressable style={styles.drawerBox}>
            <View style={styles.closeDrawer} />
          </Pressable>
          <View style={styles.usersList}>
            <AppText size='medium'>Available for Delivery</AppText>
            {usersWithDistance.length === 0 && (
              <View style={{ marginVertical: 16 }}>
                <AppText>
                  Loading drivers <ActivityIndicator />
                </AppText>
              </View>
            )}
            {usersWithDistance.map((i, index) => (
              <AvailableUserItem
                name={i.name}
                distance={i.distance}
                key={index}
                onPress={() => props.navigation.navigate("DriverProfileScreen")}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    top: 32,
    left: 32,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  bidButton: {
    position: "absolute",
    borderRadius: 20,
    backgroundColor: colors.white,
    top: 32,
    right: 32,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  bidsBox: {
    position: "absolute",
    width: "90%",
    height: Dimensions.get("screen").height * 0.55,
    backgroundColor: "rgba(0,0,0,0.5)",
    top: 20,
    elevation: 2,
    zIndex: 2,
    alignSelf: "center",

    borderRadius: 16,
  },
  closeDrawer: {
    height: 4,
    width: 54,
    backgroundColor: colors.grey,
    borderRadius: 8,
  },
  container: { flex: 1 },
  drawerBox: {
    height: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapBox: { position: "relative" },
  usersBox: {
    backgroundColor: colors.white,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  usersList: {
    padding: 30,
  },
});
export default AvailableDrivers;

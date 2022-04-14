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
import socket, { usersList } from "../api/socket";
import { getDistanceFromLatLonInKm } from "../utility/latLong";
import MapComponent from "../components/MapComponent";
import showToast from "../config/showToast";
import AuthContext from "../contexts/auth";

function AvailableDrivers(props) {
  let mounted = true;
  const { getLocation, location } = useLocation();
  const { user, setUser } = useContext(AuthContext);

  const [loadingAvailableDrivers, setLoadingAvailableDrivers] = useState(false);
  const [drivers, setDrivers] = useState([]);

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
  const getDriversAround = async () => {
    //check
    if (mounted) {
      setLoadingAvailableDrivers(true);
    }

    const { data, error } = await placesApi.getDriversAround(trip._id);
    if (!error && data) {
      if (mounted) {
        setDrivers(data);
      }
    }
    if (mounted) {
      setLoadingAvailableDrivers(false);
    }
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

  //remove myself from the list
  //filter only users within 15km of pickup point
  const usersWithinDistance = drivers.filter(
    (i) => i._id !== user._id && i.distance <= 20000
  );

  const [region, setRegion] = useState({
    latitude: 8.9233587,
    longitude: -0.3674603,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    loadTriBids();
    getDriversAround(); //check
    return () => {
      mounted = false;
    };
  }, []);

  socket.on("isonline:new", () => {
    getDriversAround(); //check
  });

  useEffect(() => {
    (async () => {
      const data = await getLocation();
      if (mounted) {
        setRegion({
          latitude: data?.coords?.latitude,
          longitude: data?.coords?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
    return () => {
      mounted = false;
    };
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
          <MaterialIcons name="error-outline" size={100} color="black" />
        </View>
        <AppText style={{ marginVertical: 16 }}>
          Error Loading Trip Details
        </AppText>
        <AppButton
          title="Go Back"
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
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={20} />
        </Pressable>
        <Pressable
          onPress={() => setShowBids(!showBids)}
          style={styles.bidButton}
        >
          <AppText style={{ color: colors.white }}>
            {showBids ? "Hide" : "Show"} bids
          </AppText>
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
                  }}
                >
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
                  onAccept={() => {
                    setAcceptBid(true);
                    acceptRejectBid(item._id, "accepted");
                  }}
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
                  onPressProfile={() => {
                    props.navigation.navigate("DriverProfileScreen", {
                      userId: item?.driver._id,
                    });
                  }}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}
        <MapComponent packages={trip.packages} />
      </View>
      <ScrollView
        style={[styles.usersBox, { height: height * 0.4 }]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View
          style={{
            flex: 1,
            marginBottom: 30,
          }}
        >
          <Pressable style={styles.drawerBox}>
            <View style={styles.closeDrawer} />
          </Pressable>
          <View style={styles.usersList}>
            <AppText size="medium">Available for Delivery</AppText>
            {usersWithinDistance.length === 0 && (
              <View style={{ marginVertical: 16 }}>
                <AppText>
                  Finding drivers nearby... <ActivityIndicator />
                </AppText>
              </View>
            )}
            {usersWithinDistance.map((i, index) => (
              <AvailableUserItem
                profilePhoto={i.profilePhoto}
                name={`${i.firstName} ${i.lastName}`}
                trips={i.trips}
                ratings={i.ratings}
                distance={i.distance}
                key={index}
                onPress={
                  () =>
                    props.navigation.navigate("DriverProfileScreen", {
                      userId: i._id,
                      trip,
                    })
                  // inviteDriver(i.userId)
                }
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
    backgroundColor: colors.primary,
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

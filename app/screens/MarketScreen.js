/** @format */

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "../components/AppText";
import TripRequestsContext from "../contexts/tripRequests";
import useLocation from "../hooks/useLocation";
import placesApi from "../api/places";
import DriverRequestPreview from "../components/DriverRequestPreview";
import socket from "../api/socket";
import useTrips from "../hooks/useTrips";
import AuthContext from "../contexts/auth";

function MarketScreen(props) {
  let mounted = true;
  const { tripRequests, setTripRequests } = useContext(TripRequestsContext);
  const { user, setUser } = useContext(AuthContext);

  const { loadTrips, loadingtrips } = useTrips();

  const [refreshing, setRefreshing] = useState(false);

  socket.on("trip:created", () => {
    loadTrips(); //check
  });
  socket.on("trip:updated:users", (data) => {
    if (data.receivers) {
      if (data.receivers.includes(user._id)) {
        if (mounted) {
          loadTrips(); //check
        }
      }
    }
  });
  useEffect(() => {
    loadTrips(); //check
    return () => {
      mounted = false;
    };
  }, []);
  const onRefresh = React.useCallback(() => {
    if (mounted) {
      setRefreshing(true);
    }
    (async () => {
      await loadTrips(); //check
      if (mounted) {
        setRefreshing(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={tripRequests}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <AppText size='header' style={[styles.black]}>
              Market{" "}
              <ActivityIndicator
                animating={loadingtrips}
                color={colors.primary}
              />
            </AppText>
            <AppText size='16' style={[styles.black, styles.mv16]}>
              Here’s where you can find deals around you. You can accept or bid
              for different delivery requests.{" "}
            </AppText>
          </View>
        }
        renderItem={({ item }) => <DriverRequestPreview requestItem={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View
            style={[
              {
                justifyContent: "center",
                alignItems: "center",
                height: 300,
              },
              styles.mv8,
            ]}>
            <ActivityIndicator
              animating={loadingtrips}
              color={colors.primary}
            />
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}>
              <FontAwesome5
                name='car-side'
                size={24}
                color='black'
                style={styles.mv8}
              />
              <AppText style={styles.mv8}>
                Trip requests will Appear Here
              </AppText>
            </View>
          </View>
        }
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    backgroundColor: colors.greyBg,
    justifyContent: "center",
  },
  bigAvatar: {
    alignItems: "center",
    width: 47,
    height: 47,
    borderRadius: 47 / 2,
    backgroundColor: colors.secondary,
    justifyContent: "center",
  },
  black: { color: colors.black },
  bold: { fontWeight: "bold" },
  borderBottom: { borderBottomColor: colors.light, borderBottomWidth: 1 },
  brad: { borderRadius: 12, overflow: "hidden" },
  buttons: { height: 50 },
  close: { width: 58, height: 4, backgroundColor: colors.light },
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingHorizontal: 16,
  },
  driverItem: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    overflow: "hidden",
  },
  driverGrey: { backgroundColor: colors.inputGray, padding: 16 },
  driverWhite: { backgroundColor: colors.white, padding: 16 },
  floatActionButton: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    paddingHorizontal: 16,
    width: "100%",
  },
  joined: {
    color: colors.success,
    backgroundColor: "rgba(76, 217, 100, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  light: { color: colors.light },
  mlAuto: { marginLeft: "auto" },
  ml10: { marginLeft: 10 },
  mt4: { marginTop: 4 },

  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  mh8: { marginHorizontal: 8 },
  mh16: { marginHorizontal: 16 },
  mr16: { marginRight: 16 },
  mv8: { marginVertical: 8 },
  mv16: { marginVertical: 16 },
  profileSection: {
    height: 163,
    backgroundColor: colors.inputGray,
    alignItems: "center",
    padding: 16,
  },
  userDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchCase: {},
  waiting: {
    color: colors.primary,
    backgroundColor: colors.lightPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
export default MarketScreen;

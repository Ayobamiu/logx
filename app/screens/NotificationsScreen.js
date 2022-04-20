/** @format */

import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import AppText from "../components/AppText";
import NotificationItem from "../components/NotificationItem";
import colors from "../config/colors";
import NotificationContext from "../contexts/notifications";
import useNotification from "../hooks/useNotification";
import { Ionicons } from "@expo/vector-icons";
import AuthContext from "../contexts/auth";
import ModeContext from "../contexts/mode";
import timeSince from "../utility/timeSince";
import PromptBottomSheet from "../components/PromptBottomSheet";
import DriverRequestPreview from "../components/DriverRequestPreview";
import { getDistanceFromLatLonInKm } from "../utility/latLong";
import useLocation from "../hooks/useLocation";

function NotificationsScreen(props) {
  let mounted = true;
  const { location } = useLocation();

  const { notifications } = useContext(NotificationContext);

  const { mode, setMode } = useContext(ModeContext);
  const [showTripInvite, setshowTripInvite] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const [trip, setTrip] = useState(null);
  const { user } = useContext(AuthContext);

  const aboutMeVerified =
    user.firstName && user.lastName && user.phoneNumber && user.deliveryType;

  const idVerified =
    user.driversLicenseVerificationStatus === "success" ||
    user.ninSlipVerificationStatus === "success" ||
    user.internationalPassportVerificationStatus === "success" ||
    user.nationalIdVerificationStatus === "success" ||
    user.votersCardVerificationStatus === "success";
  let verified = 0;
  if (aboutMeVerified) {
    verified += 1;
  }
  if (idVerified) {
    verified += 1;
  }
  const { getNotificationsFromCache, markAllAsSeen } = useNotification();
  useEffect(() => {
    getNotificationsFromCache();
    markAllAsSeen();
    return () => {
      mounted = false;
    };
  }, []);

  const onRefresh = React.useCallback(() => {
    if (mounted) {
      setRefreshing(true);
    }
    (async () => {
      getNotificationsFromCache();
      if (mounted) {
        setRefreshing(false);
      }
    })();
  }, []);

  return (
    <View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={notifications}
        keyExtractor={(item) => item.timestamp?.toString()}
        ListEmptyComponent={() => (
          <View
            style={{
              height: 400,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="ios-notifications-outline"
              size={70}
              style={{ marginBottom: 10 }}
            />
            <AppText>Your notifications will show here!</AppText>
          </View>
        )}
        ListHeaderComponent={
          <AppText size="header" style={[styles.bold, styles.mb10]}>
            Notifications
          </AppText>
        }
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <NotificationItem
            header={item.data.request.content.title}
            subHeader={`${timeSince(new Date(item.timestamp), true)} ago`}
            text={item.data.request.content.body}
            onPress={() => {
              if (item.data.request.content.data) {
                if (item.data.request.content.data?.type === "trip:code") {
                  props.navigation.navigate(
                    "CopyTripCodeScreen",
                    item.data.request.content.data
                  );
                }
                if (
                  item.data.request.content.data?.type === "trip:status" ||
                  item.data.request.content.data?.type === "trip:time:request"
                ) {
                  props.navigation.navigate(
                    "TransactionDetailsScreen",
                    item.data.request.content.data
                  );
                }
                if (
                  item.data.request.content.data?.type === "transaction:update"
                ) {
                  props.navigation.navigate(
                    "TransactionDetails",
                    item.data.request.content.data?.transaction
                  );
                }
                if (item.data.request.content.data?.type === "bid:new") {
                  props.navigation.navigate("TransactionDetailsScreen", {
                    item: item.data.request.content.data?.trip,
                  });
                }
                if (item.data.request.content.data?.type === "chat:new") {
                  props.navigation.navigate("ChatScreen", {
                    tripId: item.data.request.content.data?.trip,
                  });
                }
                if (item.data.request.content.data?.type === "trip:new") {
                  setMode("driver");
                  props.navigation.navigate(
                    verified === 2
                      ? "DeliveryMerchantHomepage"
                      : "DriverSettingsScreen"
                  );
                }
                if (item.data.request.content.data?.type === "trip:invite") {
                  // sender? change to driver
                  //verified? show popup
                  if (mode === "sender") {
                    setMode("driver");
                  }
                  if (verified === 2) {
                    setTrip({
                      ...item.data.request.content.data?.trip,
                      distance: getDistanceFromLatLonInKm(
                        location?.coords?.latitude,
                        location?.coords?.longitude,
                        item.data.request.content.data?.trip?.packages[0]
                          ?.pickUpAddressLat,
                        item.data.request.content.data?.trip?.packages[0]
                          ?.pickUpAddressLong
                      ),
                    });
                    setshowTripInvite(true);
                  } else {
                    props.navigation.navigate(
                      verified === 2
                        ? "DeliveryMerchantHomepage"
                        : "DriverSettingsScreen"
                    );
                  }
                }
              }
            }}
          />
        )}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: colors.light,
              marginVertical: 10,
            }}
          />
        )}
      />
      <PromptBottomSheet
        isVisble={showTripInvite}
        toggleModal={() => setshowTripInvite(false)}
      >
        <DriverRequestPreview requestItem={trip} />
      </PromptBottomSheet>
    </View>
  );
}
const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  container: { padding: 16 },
  fs14: { fontSize: 14 },
  mb10: { marginBottom: 10 },
  mh16: { marginHorizontal: 16 },
  mv10: { marginVertical: 10 },
  primary: { color: colors.primary },
});
export default NotificationsScreen;

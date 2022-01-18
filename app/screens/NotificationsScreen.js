/** @format */

import React, { useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import AppText from "../components/AppText";
import NotificationItem from "../components/NotificationItem";
import colors from "../config/colors";
import NotificationContext from "../contexts/notifications";
import useNotification from "../hooks/useNotification";
import { Ionicons } from "@expo/vector-icons";
import AuthContext from "../contexts/auth";
import ModeContext from "../contexts/mode";

function NotificationsScreen(props) {
  const { notifications } = useContext(NotificationContext);
  const { mode, setMode } = useContext(ModeContext);

  const { user } = useContext(AuthContext);

  let verified = 0;
  if (user.verificationPhoto) {
    verified += 1;
  }
  if (user.nationalId || user.votersCard || user.internationalPassport) {
    verified += 1;
  }
  const { getNotificationsFromCache } = useNotification();
  useEffect(() => {
    getNotificationsFromCache();
  }, []);

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.timestamp?.toString()}
      ListEmptyComponent={() => (
        <View
          style={{
            height: 400,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Ionicons
            name='ios-notifications-outline'
            size={70}
            style={{ marginBottom: 10 }}
          />
          <AppText>Your notifications will show here!</AppText>
        </View>
      )}
      ListHeaderComponent={
        <AppText size='header' style={[styles.bold, styles.mb10]}>
          Notifications
        </AppText>
      }
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <NotificationItem
          header={item.data.request.content.title}
          subHeader={new Date(item.data.date).toLocaleTimeString()}
          text={item.data.request.content.body}
          onPress={() => {
            if (item.data.request.content.data.type === "trip:code") {
              props.navigation.navigate(
                "CopyTripCodeScreen",
                item.data.request.content.data
              );
            }
            if (item.data.request.content.data.type === "trip:status") {
              props.navigation.navigate(
                "TransactionDetailsScreen",
                item.data.request.content.data
              );
            }
            if (item.data.request.content.data.type === "trip:new") {
              setMode("driver");
              if (mode === "sender") {
                props.navigation.navigate(
                  verified === 2
                    ? "DeliveryMerchantHomepage"
                    : "DriverSettingsScreen"
                );
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
  );
}
const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  container: {},
  fs14: { fontSize: 14 },
  mb10: { marginBottom: 10 },
  mh16: { marginHorizontal: 16 },
  mv10: { marginVertical: 10 },
  primary: { color: colors.primary },
});
export default NotificationsScreen;

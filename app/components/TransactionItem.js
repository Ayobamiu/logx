/** @format */

import React, { useContext } from "react";
import { View, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "./AppText";
import getInitial from "../utility/getInitials";
import figureAlpha from "../utility/figureAlpha";
import NotificationContext from "../contexts/notifications";

function TransactionItem({ onPress, item }) {
  let waitingFor = 0;
  if (!item.sender) {
    waitingFor += 1;
  }
  if (!item.driver) {
    waitingFor += 1;
  }
  const { notifications, setNotifications } = useContext(NotificationContext);
  const relatedNotifications = notifications.filter(
    (notification) =>
      notification.data.request.content.data?.type === "chat:new" &&
      notification.data.request.content.data.trip === item._id
  );
  return (
    <TouchableOpacity
      style={[styles.container, styles.border, { padding: 16 }]}
      onPress={onPress}>
      {relatedNotifications?.length > 0 && (
        <View style={styles.newChatIndicator}>
          <AppText style={[styles.white, styles.bold]}>
            {relatedNotifications?.length}
          </AppText>
        </View>
      )}
      <View style={[styles.container, { flex: 0.3, overflow: "scroll" }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <AppText style={{ color: colors.white, textTransform: "uppercase" }}>
            {getInitial(item?.sender?.firstName, item?.sender?.lastName)}
          </AppText>
        </View>
        <View
          style={[
            styles.avatar,
            { backgroundColor: colors.customBlue, left: -10 },
          ]}>
          <AppText style={{ color: colors.white, textTransform: "uppercase" }}>
            {getInitial(item?.driver?.firstName, item?.driver?.lastName)}
          </AppText>
        </View>

        {item.packages.map((i, index) => (
          <View
            key={index}
            style={[
              styles.avatar,
              { backgroundColor: colors.dark, left: -10 - (index + 1) * 10 },
            ]}>
            <AppText
              style={{ color: colors.white, textTransform: "uppercase" }}>
              {getInitial(i?.receipentName)}
            </AppText>
          </View>
        ))}
      </View>
      <View style={[{ flex: 0.6 }]}>
        {waitingFor > 0 ? (
          <AppText numberOfLines={1}>
            Waiting for {figureAlpha[waitingFor]}{" "}
            {waitingFor > 1 ? "people" : "person"} to connect
          </AppText>
        ) : (
          <AppText numberOfLines={1}>Users connected for trip</AppText>
        )}
      </View>
      <View style={[{ flex: 0.1 }]}>
        <View
          style={[styles.avatar, { backgroundColor: colors.opaquePrimary }]}>
          <Ionicons name='arrow-forward' size={20} color={colors.darkyellow} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderColor: colors.white,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bold: { fontWeight: "bold" },

  border: { borderColor: colors.grey, borderWidth: 1 },
  container: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  newChatIndicator: {
    position: "absolute",
    top: -10,
    borderRadius: 20,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    paddingHorizontal: 10,
  },
  white: { color: colors.white },
});
export default TransactionItem;

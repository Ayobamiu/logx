/** @format */

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

function NotificationItem({ header, subHeader, text, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={{ marginLeft: 10, flex: 1 }}>
        <View
          style={[
            { flexDirection: "row", justifyContent: "space-between" },
            styles.mb10,
          ]}>
          <AppText numberOfLines={1} style={[styles.bold]}>
            {header}
          </AppText>
          <AppText numberOfLines={1} style={[styles.light]}>
            {subHeader}
          </AppText>
        </View>
        <AppText numberOfLines={1}>{text}</AppText>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 22.5,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  bold: { fontWeight: "bold" },

  container: {
    flexDirection: "row",
    marginVertical: 8,
  },
  light: { color: colors.light },
  mb10: { marginBottom: 8 },
});
export default NotificationItem;

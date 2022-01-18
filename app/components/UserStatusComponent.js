import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";
import { AntDesign } from "@expo/vector-icons";

function UserStatusComponent({ heading, imageUrl, subHeading, status }) {
  return (
    <View style={[styles.container, styles.row]}>
      <Pressable style={styles.avatar}>
        <AntDesign name="user" size={24} color={colors.black} />
      </Pressable>
      <View style={styles.ml10}>
        <AppText size="16" style={styles.bold}>
          {heading}
        </AppText>
        <AppText size="16" style={styles.light}>
          {subHeading}
        </AppText>
      </View>
      <AppText
        size="16"
        style={[
          styles.brad,
          styles.light,
          styles.mlAuto,
          status === "Waiting" && styles.waiting,
          status === "Joined" && styles.joined,
        ]}
      >
        {status}
      </AppText>
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
  bold: { fontWeight: "bold" },
  container: { marginVertical: 10 },
  joined: {
    color: colors.success,
    backgroundColor: "rgba(76, 217, 100, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  light: { color: colors.light },
  mlAuto: { marginLeft: "auto" },
  ml10: { marginLeft: 10 },
  row: { flexDirection: "row", alignItems: "center" },
  brad: { borderRadius: 12, overflow: "hidden" },
  waiting: {
    color: colors.primary,
    backgroundColor: colors.lightPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
export default UserStatusComponent;

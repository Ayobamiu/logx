import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "./AppText";

function QuickActonItem({ onPress }) {
  return (
    <Pressable style={[styles.container, { padding: 16 }]} onPress={onPress}>
      <View style={styles.container}>
        <View style={[styles.avatar, { backgroundColor: colors.white }]}>
          <Feather name="map-pin" size={24} color={colors.darkyellow} />
        </View>

        <AppText size="16" style={[styles.ml10]}>
          Track your deliveries
        </AppText>
      </View>
      <Ionicons name="arrow-forward" size={20} color={colors.darkyellow} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  avatar: {
    height: 54,
    width: 54,
    borderRadius: 10,
    borderColor: colors.white,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bold: { fontWeight: "bold" },
  border: { borderColor: colors.grey, borderWidth: 1 },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: colors.inputGray,
    borderRadius: 10,
  },
  ml10: {
    marginLeft: 10,
  },
});
export default QuickActonItem;

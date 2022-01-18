import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../config/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AppText from "./AppText";

function MapLabel({text}) {
  return (
    <View style={styles.container}>
      <Ionicons name="location" />
      <AppText> {text}</AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: 166,
    height: 37,
    borderRadius: 18.5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});
export default MapLabel;

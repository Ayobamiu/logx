/** @format */

import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../config/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AppText from "./AppText";

function MapLabel({ text }) {
  return (
    <View style={styles.container}>
      <Ionicons name='location' />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {},
});
export default MapLabel;

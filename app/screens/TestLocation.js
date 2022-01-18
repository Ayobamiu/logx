/** @format */

import React from "react";
import { View, StyleSheet } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import axios from "axios";
import useLocation from "../hooks/useLocation";
import AppText from "../components/AppText";
import server from "../api/server";

function TestLocation(props) {
  const { location } = useLocation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <AppText>Location</AppText>
      <AppText>latitude: {location?.coords?.latitude}</AppText>
      <AppText>longitude: {location?.coords?.longitude}</AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {},
});
export default TestLocation;

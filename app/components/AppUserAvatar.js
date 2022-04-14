/** @format */

import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Fontisto, Ionicons, Feather } from "@expo/vector-icons";
import colors from "../config/colors";

function AppUserAvatar({
  profilePhoto,
  color = colors.white,
  size = "large",
  backgroundColor = colors.transparent,
  onPress = () => {},
}) {
  let width = 55;
  if (size === "small") {
    width = 32;
  }
  if (!profilePhoto || profilePhoto === "")
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: width,
          height: width,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor,
          borderRadius: width / 2,
        }}>
        <Feather name='user' size={width * 0.8} color={color} />
      </TouchableOpacity>
    );
  return (
    <TouchableOpacity onPress={onPress}>
      <ImageBackground
        source={{ uri: profilePhoto }}
        style={{
          width: width,
          height: width,
          justifyContent: "center",
          alignItems: "center",
        }}
        borderRadius={width / 2}
      />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {},
});
export default AppUserAvatar;

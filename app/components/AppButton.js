/** @format */

import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../config/colors";

function AppButton({
  fullWidth = false,
  disabled = false,
  small = false,
  whiteText = false,
  secondary = false,
  title,
  onPress = () => {},
  style,
  Icon,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        small ? styles.small : styles.big,
        fullWidth && styles.width100,
        secondary && styles.secondaryButton,
        disabled && styles.opaque,
        style,
      ]}
      disabled={disabled}
      onPress={onPress}>
      <Text
        style={[
          styles.text,
          secondary && styles.secondaryText,
          whiteText && styles.whiteText,
        ]}>
        {title}
      </Text>
      {Icon}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  big: {
    padding: 16,
    paddingHorizontal: 32,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  opaque: { opacity: 0.5 },
  secondaryButton: {
    backgroundColor: colors.transparent,
    elevation: 0,
  },
  secondaryText: {
    color: colors.secondary,
  },
  text: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "bold",
  },
  small: {
    padding: 8,
    paddingHorizontal: 16,
  },
  width100: {
    width: "100%",
  },
  whiteText: {
    color: colors.white,
  },
});
export default AppButton;

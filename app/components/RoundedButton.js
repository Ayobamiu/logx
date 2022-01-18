import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../config/colors";
const RoundedButton = ({ label, onPress }) => {
  return (
    <TouchableOpacity style={styles.round} onPress={onPress}>
      <Text style={{ color: "white", fontWeight: "bold", marginHorizontal: 8 }}>
        {label}
      </Text>
      <Feather name="arrow-right" size={24} color="white" />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  round: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    backgroundColor: colors.opaqueBalck,
    height: 50,
    flexDirection: "row",
    paddingHorizontal: 16,
  },
});

export default RoundedButton;

/** @format */

import React from "react";

import { StyleSheet, TouchableOpacity, View } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";
import { Feather } from "@expo/vector-icons";

const TripItem = ({ index, onPress, packageItem }) => {
  return (
    <View style={[styles.mb16]}>
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "95%",
          },
        ]}>
        <TouchableOpacity
          onPress={onPress}
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              padding: 8,
              backgroundColor: colors.inputGray,
              borderRadius: 26,
              justifyContent: "space-between",
              flex: 0.8,
            },
          ]}>
          <View
            style={{
              padding: 8,
              backgroundColor: colors.primary,
              borderRadius: 26,
            }}>
            <AppText style={[styles.black]}>Destination {index + 1}</AppText>
          </View>

          <Feather
            name='arrow-right'
            size={15}
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>
        {packageItem.status === "completed" ? (
          <AppText style={[{ color: colors.success }, styles.bold]}>
            Completed
          </AppText>
        ) : (
          <AppText style={[styles.black, styles.bold]}>Complete</AppText>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  mb16: { marginBottom: 16 },
});
export default TripItem;

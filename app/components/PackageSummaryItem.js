import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";
import { Ionicons } from "@expo/vector-icons";
function PackageSummaryItem(props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.pill, styles.row]}>
          <AppText>Destination 1</AppText>
        </View>
        <AppText>Chek out the details</AppText>
      </View>
      <Ionicons name="arrow-forward" size={15} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.inputGray,
    height: 52,
    borderRadius: 52 / 2,
    marginVertical: 8,
    padding: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pill: {
    minWidth: 120,
    backgroundColor: colors.primary,
    borderRadius: 52 / 2,
    marginRight: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
  },
});
export default PackageSummaryItem;

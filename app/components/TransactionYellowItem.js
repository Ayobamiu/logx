/** @format */

import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";
import { Ionicons } from "@expo/vector-icons";
import getInitial from "../utility/getInitials";
import figureAlpha from "../utility/figureAlpha";

function TransactionYellowItem({ onPress, item }) {
  let waitingFor = 3;
  if (item.sender) {
    waitingFor -= 1;
  }
  if (item.driver) {
    waitingFor -= 1;
  }
  if (item.receipent) {
    waitingFor -= 1;
  }
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.row]}>
        <AppText size='medium' style={styles.bold}>
          {item.tripCode}
        </AppText>
        <View style={styles.status}>
          <AppText style={{ color: colors.primary, fontWeight: "bold" }}>
            {item.status}
          </AppText>
        </View>
        <AppText style={[styles.mlAuto, styles.white]}>
          {new Date(item.createdAt).toDateString()}{" "}
          {/* {new Date(item.createdAt).toLocaleTimeString()} */}
        </AppText>
      </View>
      <AppText style={[styles.mt10, styles.white]} numberOfLines={2}>
        This transaction has been initiated, waiting for{" "}
        {figureAlpha[waitingFor]} partners to join
      </AppText>
      <View style={[styles.row, styles.jcBetween, styles.mt10]}>
        <View style={[styles.row]}>
          <View style={[styles.avatar, { backgroundColor: colors.orange }]}>
            <AppText
              style={{ color: colors.black, textTransform: "uppercase" }}>
              {getInitial(item?.sender?.firstName, item?.sender?.lastName)}
            </AppText>
          </View>
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.customBlue, left: -10 },
            ]}>
            <AppText
              style={{ color: colors.white, textTransform: "uppercase" }}>
              {getInitial(item?.driver?.firstName, item?.driver?.lastName)}
            </AppText>
          </View>
          {item.packages.map((i, index) => (
            <View
              key={index}
              style={[
                styles.avatar,
                { backgroundColor: colors.dark, left: -10 - (index + 1) * 10 },
              ]}>
              <AppText
                style={{ color: colors.white, textTransform: "uppercase" }}>
                {getInitial(i?.receipentName)}
              </AppText>
            </View>
          ))}
        </View>
        <View style={[styles.avatar, { backgroundColor: colors.white }]}>
          <Ionicons name='arrow-forward' color={colors.primary} size={20} />
        </View>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderColor: colors.white,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bold: { fontWeight: "bold" },
  container: {
    width: "100%",
    minHeight: 135,
    backgroundColor: colors.primary,
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
  },
  jcBetween: { justifyContent: "space-between" },
  mlAuto: { marginLeft: "auto" },
  mt5: { marginTop: 5 },
  mt10: { marginTop: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  status: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  white: {
    color: colors.white,
  },
});
export default TransactionYellowItem;

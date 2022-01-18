/** @format */

import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "./AppText";
import getInitial from "../utility/getInitials";
import figureAlpha from "../utility/figureAlpha";

function TransactionItem({ onPress, item }) {
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
    <Pressable
      style={[styles.container, styles.border, { padding: 16 }]}
      onPress={onPress}>
      <View style={styles.container}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <AppText style={{ color: colors.white, textTransform: "uppercase" }}>
            {getInitial(item?.sender?.firstName, item?.sender?.lastName)}
          </AppText>
        </View>
        <View
          style={[
            styles.avatar,
            { backgroundColor: colors.customBlue, left: -10 },
          ]}>
          <AppText style={{ color: colors.white, textTransform: "uppercase" }}>
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
      <AppText>Waiting for {figureAlpha[waitingFor]} people to...</AppText>
      <View style={[styles.avatar, { backgroundColor: colors.opaquePrimary }]}>
        <Ionicons name='arrow-forward' size={20} color={colors.darkyellow} />
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
  border: { borderColor: colors.grey, borderWidth: 1 },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
});
export default TransactionItem;

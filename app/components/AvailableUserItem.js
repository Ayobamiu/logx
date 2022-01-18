/** @format */

import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

function AvailableUserItem({ onPress = () => {}, name, distance }) {
  const [km, setKm] = useState(distance / 1000);

  return (
    <Pressable onPress={onPress} style={[styles.container, styles.row]}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <FontAwesome5 name='user' color={colors.black} size={15} />
        </View>
        <View style={{ marginLeft: 10 }}>
          <AppText size='16'>
            {name}
            <AppText size='x-small' style={styles.italic}>
              {" "}
              {km > 0 ? `${km}km Away` : `${distance}m Away`}
            </AppText>
          </AppText>
          <View style={[styles.row]}>
            <Ionicons name='star' color={colors.primary} size={15} />
            <Ionicons name='star' color={colors.primary} size={15} />
            <Ionicons name='star' color={colors.primary} size={15} />
            <Ionicons name='star' color={colors.primary} size={15} />
            <Ionicons name='star' color={colors.greyBg} size={15} />
            <AppText size='16'>
              4.5
              <AppText size='x-small' style={styles.light}>
                {" "}
                (110 deliveries)
              </AppText>
            </AppText>
          </View>
        </View>
      </View>
      <FontAwesome5 name='angle-right' color={colors.black} size={20} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: colors.grey,
    borderRadius: 32 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    marginVertical: 15,
    justifyContent: "space-between",
  },
  light: { color: colors.light },
  italic: { fontStyle: "italic" },
  row: { flexDirection: "row", alignItems: "center" },
});
export default AvailableUserItem;

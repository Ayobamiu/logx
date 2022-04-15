/** @format */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import AppUserAvatar from "./AppUserAvatar";

function AvailableUserItem({
  onPress = () => {},
  name,
  distance,
  profilePhoto,
  ratings,
  trips,
}) {
  const [km, setKm] = useState(distance / 1000);
  const ratingz = [1, 2, 3, 4, 5];
  const sum = ratings?.reduce((a, b) => a + b, 0);
  const userRating = sum / ratings?.length || 0;
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, styles.row]}>
      <View style={styles.row}>
        <AppUserAvatar
          size="small"
          profilePhoto={profilePhoto}
          color={colors.black}
          backgroundColor={colors.grey}
          onPress={onPress}
        />
        <View style={{ marginLeft: 10 }}>
          <AppText size="16">
            {name}
            <AppText size="x-small" style={styles.italic}>
              {" "}
              {km > 0
                ? `${Math.round(km)}km Away`
                : `${Math.round(distance)}m Away`}
            </AppText>
          </AppText>
          <View style={[styles.row]}>
            {ratingz.map((i, index) => (
              <Ionicons
                key={index}
                name={i > userRating ? "star-outline" : "star"}
                size={15}
                color={i > userRating ? colors.black : colors.primary}
              />
            ))}
            <AppText size="16">
              {userRating}
              {trips ? (
                <AppText size="x-small" style={styles.light}>
                  {" "}
                  ({trips} deliveries)
                </AppText>
              ) : null}
            </AppText>
          </View>
        </View>
      </View>
      <FontAwesome5 name="angle-right" color={colors.black} size={20} />
    </TouchableOpacity>
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

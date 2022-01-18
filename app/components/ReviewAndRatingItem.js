/** @format */

import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";

function ReviewAndRatingItem({ sender, rating, createdAt, comment }) {
  const ratings = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      {sender.profilePhoto ? (
        <ImageBackground
          style={styles.avatar}
          source={{ uri: sender.profilePhoto }}
        />
      ) : (
        <Feather
          name='user'
          size={30}
          color={colors.black}
          style={styles.avatar}
        />
      )}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View>
            <AppText style={styles.bold}>
              {sender?.firstName} {sender?.lastName}
            </AppText>
            <AppText size='x-small' style={styles.light}>
              Sender
            </AppText>
          </View>
          <View>
            <View style={styles.row}>
              {ratings.map((i, index) => (
                <AntDesign
                  key={index}
                  name={i > rating ? "staro" : "star"}
                  size={15}
                  color={i > rating ? colors.black : colors.primary}
                  onPress={() => setRating(i)}
                />
              ))}
            </View>
            <AppText style={styles.light} size='x-small'>
              {new Date(createdAt).toLocaleDateString()}
            </AppText>
          </View>
        </View>
        <AppText style={styles.text}>{comment || "No comment"}</AppText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    backgroundColor: colors.greyBg,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  bold: { fontWeight: "bold" },
  container: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 16,
  },
  light: { color: colors.light },
  row: { flexDirection: "row", alignItems: "center" },
  text: { marginTop: 10, textAlign: "justify", color: colors.secondary },
});
export default ReviewAndRatingItem;

import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";
import { Feather, FontAwesome5 } from "@expo/vector-icons";

function ConversationItemRight({ text, imageUrl, time }) {
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.avatar}>
        <FontAwesome5 name="user" color={colors.secondary} size={15} />
      </ImageBackground>
      <View
        style={{
          flex: 1,
          marginRight: 10,
        }}
      >
        <View
          style={{
            backgroundColor: colors.FDF7E7,
            padding: 10,
            borderRadius: 18,
          }}
        >
          <AppText style={styles.text}>{text}</AppText>
        </View>
        <View style={[styles.row, { justifyContent: "flex-start" }]}>
          <AppText style={styles.light}>{time}</AppText>
          <Feather name="check" size={24} style={styles.light} />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    backgroundColor: colors.FDF7E7,
    justifyContent: "center",
    alignItems: "center",
  },
  bold: { fontWeight: "bold" },
  container: {
    flexDirection: "row-reverse",
    width: "90%",
    alignItems: "flex-start",
    marginBottom: 16,
    alignSelf: "flex-end",
  },
  light: { color: colors.light, fontWeight: "200" },
  row: { flexDirection: "row", alignItems: "center" },
  text: { color: colors.secondary },
});
export default ConversationItemRight;

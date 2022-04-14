/** @format */

import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import AppUserAvatar from "./AppUserAvatar";
import showToast from "../config/showToast";
import copyToClipboard from "../config/copyToClipboard";

function ConversationItemRight({ text, imageUrl, time, name }) {
  return (
    <View style={styles.container}>
      <AppUserAvatar
        size='small'
        profilePhoto={imageUrl}
        backgroundColor={colors.FDF7E7}
      />
      <View
        style={{
          flex: 1,
          marginRight: 10,
        }}>
        <View
          style={{
            backgroundColor: colors.FDF7E7,
            padding: 10,
            borderRadius: 18,
          }}>
          <AppText
            style={styles.text}
            onPress={() => {
              copyToClipboard(text);
              showToast("Text Copied");
            }}>
            {text}
          </AppText>
        </View>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <AppText style={[styles.light, { flex: 0.5 }]} numberOfLines={1}>
            {name}
          </AppText>
          <View style={[styles.row, { flex: 0.5, justifyContent: "flex-end" }]}>
            <AppText style={styles.light}>{time}</AppText>
            <Feather name='check' size={24} style={styles.light} />
          </View>
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

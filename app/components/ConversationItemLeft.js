/** @format */

import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import AppUserAvatar from "./AppUserAvatar";
import copyToClipboard from "../config/copyToClipboard";
import showToast from "../config/showToast";

function ConversationItemLeft({ text, imageUrl, time, name }) {
  return (
    <View style={styles.container}>
      {/* <ImageBackground style={styles.avatar}>
        <FontAwesome5 name='user' color={colors.secondary} size={15} />
      </ImageBackground> */}
      <AppUserAvatar
        size='small'
        profilePhoto={imageUrl}
        backgroundColor={colors.greyBg}
      />
      <View
        style={{
          flex: 1,
          marginLeft: 10,
        }}>
        <View
          style={{
            backgroundColor: colors.greyBg,
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
          <View
            style={[styles.row, { flex: 0.5, justifyContent: "flex-start" }]}>
            <AppText style={styles.light}>{time}</AppText>
            <Feather name='check' size={24} style={styles.light} />
          </View>
          <AppText
            style={[styles.light, { flex: 0.5, textAlign: "right" }]}
            numberOfLines={1}>
            {name}
          </AppText>
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
    backgroundColor: colors.greyBg,
    justifyContent: "center",
    alignItems: "center",
  },
  bold: { fontWeight: "bold" },
  container: {
    flexDirection: "row",
    width: "90%",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  light: { color: colors.light, fontWeight: "200" },
  row: { flexDirection: "row", alignItems: "center" },
  text: { color: colors.secondary },
});
export default ConversationItemLeft;

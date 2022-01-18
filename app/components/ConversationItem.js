import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";
import { Ionicons, Feather } from "@expo/vector-icons";

function ConversationItem(props) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.avatar}>
        <Feather name="user" color={colors.secondary} size={15} />
      </Pressable>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <AppText style={styles.bold}>Adekola James</AppText>
          <View style={styles.row}>
            <Ionicons name="star" color={colors.primary} size={15} />
            <Ionicons name="star" color={colors.primary} size={15} />
            <Ionicons name="star" color={colors.primary} size={15} />
            <Ionicons name="star" color={colors.primary} size={15} />
            <Ionicons name="star" color={colors.greyBg} size={15} />
          </View>
        </View>
        <AppText style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consectetur
          lectus neque, condimentum eget placerat. Eu porta tellus sed nec.
          Maecenas tincidunt commodo eget vitae orci porta varius. Sem felis eu
          congue volutpat hendrerit convallis at diam sapien.{" "}
        </AppText>
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
    width: "100%",
    alignItems: "baseline",
    marginBottom: 16,
  },
  row: { flexDirection: "row", alignItems: "center" },
  text: { marginTop: 10, textAlign: "justify", color: colors.secondary },
});
export default ConversationItem;

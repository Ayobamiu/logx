import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather, AntDesign, Fontisto } from "@expo/vector-icons";
import colors from "../config/colors";
import AppText from "./AppText";

function PreviewPackageDetails({ item }) {
  return (
    <View style={styles.container}>
      <View>
        <View style={[{ flexDirection: "row" }, styles.mv8]}>
          <Fontisto
            name="map-marker-alt"
            color={colors.primary}
            size={10}
            style={[styles.mr16, styles.mt4]}
          />
          <View>
            <AppText style={[styles.light, styles.mb8]}>Pickup</AppText>
            <AppText>{item?.pickUpAddress}</AppText>
          </View>
        </View>
        <View style={[{ flexDirection: "row" }, styles.mb8]}>
          <Fontisto
            name="circle-o-notch"
            color={colors.primary}
            size={10}
            style={[styles.mr16, styles.mt4]}
          />
          <View>
            <AppText style={[styles.light, styles.mb8]}>Destination</AppText>
            <AppText>{item?.deliveryAddress}</AppText>
          </View>
        </View>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={{ flex: 0.5, flexShrink: 0 }}>
            <AppText style={[styles.light, styles.mb8]}>
              Package Category
            </AppText>
            <AppText>Clothes, Paper</AppText>
          </View>
          <View style={{ flex: 0.5, flexShrink: 0 }}>
            <AppText style={[styles.light, styles.mb8]}>Date and time</AppText>
            <AppText>
              {new Date(item?.date).toLocaleDateString()}{" "}
              {new Date(item?.date).toLocaleTimeString()}
            </AppText>
          </View>
        </View>

        <AppText style={[styles.light, styles.mv8]}>
          Package Description
        </AppText>
        <AppText>{item?.description}</AppText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    backgroundColor: colors.greyBg,
    justifyContent: "center",
  },
  bigAvatar: {
    alignItems: "center",
    width: 47,
    height: 47,
    borderRadius: 47 / 2,
    backgroundColor: colors.secondary,
    justifyContent: "center",
  },
  black: { color: colors.black },
  bold: { fontWeight: "bold" },
  borderBottom: { borderBottomColor: colors.light, borderBottomWidth: 1 },
  brad: { borderRadius: 12, overflow: "hidden" },
  buttons: { height: 50 },
  close: { width: 58, height: 4, backgroundColor: colors.light },
  container: {},
  driverItem: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    overflow: "hidden",
  },
  driverGrey: { backgroundColor: colors.inputGray, padding: 16 },
  driverWhite: { backgroundColor: colors.white, padding: 16 },
  floatActionButton: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    paddingHorizontal: 16,
    width: "100%",
  },
  joined: {
    color: colors.success,
    backgroundColor: "rgba(76, 217, 100, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  light: { color: colors.light },
  mlAuto: { marginLeft: "auto" },
  ml10: { marginLeft: 10 },
  mt4: { marginTop: 4 },

  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  mh8: { marginHorizontal: 8 },
  mh16: { marginHorizontal: 16 },
  mr16: { marginRight: 16 },
  mv8: { marginVertical: 8 },
  mv16: { marginVertical: 16 },
  profileSection: {
    height: 163,
    backgroundColor: colors.inputGray,
    alignItems: "center",
    padding: 16,
  },
  userDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchCase: {},
  waiting: {
    color: colors.primary,
    backgroundColor: colors.lightPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
export default PreviewPackageDetails;

/** @format */

import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import AppButton from "./AppButton";

function BidResponseItem({
  onReject = () => {},
  onAccept = () => {},
  bidItem,
  loadingAccept = false,
  loadingReject = false,
  disableButtons = false,
}) {
  const width = Dimensions.get("screen").width;
  if (bidItem.status === "rejected") return null;
  return (
    <View style={[styles.container, { width: width - 48 }]}>
      <View style={styles.textSection}>
        <ImageBackground
          source={{ uri: bidItem?.driver?.profilePhoto }}
          style={styles.avatar}
          resizeMode='cover'
          style={styles.avatar}
          borderRadius={32 / 2}>
          {!bidItem?.driver?.profilePhoto && (
            <AntDesign name='user' size={24} color={colors.black} />
          )}
        </ImageBackground>
        <View style={styles.mr10}>
          <AppText style={[styles.unselectedText]}>Ratings</AppText>
          <View style={[styles.row]}>
            <Ionicons name='star' color={colors.primary} size={15} />
            <Ionicons name='star' color={colors.primary} size={15} />
            <Ionicons name='star' color={colors.primary} size={15} />
            <Ionicons name='star' color={colors.primary} size={15} />
            <Ionicons name='star' color={colors.greyBg} size={15} />
            <AppText size='16'>
              4.5
              <AppText size='x-small' style={styles.light}>
                (110)
              </AppText>
            </AppText>
          </View>
        </View>
        <AppText size='medium' style={[styles.black, styles.mlAuto]}>
          &#8358;{bidItem?.price}
        </AppText>
      </View>
      <View
        style={[styles.row, { height: 65, justifyContent: "space-around" }]}>
        {bidItem?.status !== "accepted" && bidItem?.status !== "rejected" && (
          <AppButton
            title={
              loadingReject ? (
                <ActivityIndicator animating={loadingReject} />
              ) : (
                "Not interested"
              )
            }
            small
            secondary
            style={styles.border}
            onPress={onReject}
            disabled={disableButtons}
          />
        )}
        {bidItem?.status !== "accepted" && bidItem?.status !== "rejected" && (
          <AppButton
            title={
              loadingAccept ? (
                <ActivityIndicator
                  animating={loadingAccept}
                  color={colors.white}
                />
              ) : (
                "Accept offer"
              )
            }
            whiteText
            small
            onPress={onAccept}
            disabled={disableButtons}
          />
        )}

        {bidItem?.status === "accepted" && (
          <View
            style={{
              backgroundColor: colors.successLight,
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <AppText style={{ color: colors.success }}>Accepted</AppText>
          </View>
        )}
        {bidItem?.status === "rejected" && (
          <View
            style={{
              backgroundColor: colors.dangerLight,
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <AppText style={{ color: colors.danger }}>Rejected</AppText>
          </View>
        )}
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
  black: {
    color: colors.black,
  },
  bold: {
    fontWeight: "bold",
  },
  border: { borderColor: colors.light, borderWidth: 1, borderRadius: 100 },
  container: {
    height: 155,
    borderColor: colors.light,
    borderWidth: 1,
    marginRight: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  light: { color: colors.light },
  mr10: { marginHorizontal: 10 },
  mlAuto: { marginLeft: "auto" },
  mt10: { marginTop: 10 },
  textSection: {
    height: 90,
    borderBottomColor: colors.light,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  row: { flexDirection: "row", alignItems: "center" },
});
export default BidResponseItem;

/** @format */

import React, { useContext, useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import AppText from "../components/AppText";
import colors from "../config/colors";
import AuthContext from "../contexts/auth";

function DriverSettingsScreen(props) {
  const { user } = useContext(AuthContext);
  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      title: <AppText size='header'>Welcome, {user.firstName}</AppText>,
    });
  });
  const VerificationItem = ({ onPress, title, subTitle, uploaded = false }) => {
    return (
      <Pressable
        onPress={onPress}
        style={[
          styles.row,
          {
            borderBottomColor: colors.light,
            borderBottomWidth: 1,
            paddingVertical: 16,
          },
        ]}>
        <View>
          <AppText size='16' style={[styles.mh10, styles.bold]}>
            {title}
          </AppText>
          <AppText size='16' style={[styles.mh10, { color: colors.light }]}>
            {uploaded ? "Completed" : "Start now"}
          </AppText>
        </View>
        <View style={[styles.row, { marginLeft: "auto" }]}>
          {uploaded && (
            <Ionicons
              name='checkmark-circle'
              size={16}
              color={colors.success}
              style={[styles.mh10]}
            />
          )}
          <Fontisto
            name='angle-right'
            size={16}
            color={colors.black}
            style={[styles.mh10]}
          />
        </View>
      </Pressable>
    );
  };

  const aboutMeVerified =
    user.firstName && user.lastName && user.phoneNumber && user.deliveryType;

  // const idVerified =
  //   user.driversLicenseVerificationStatus === "success" ||
  //   user.nationalIdVerificationStatus === "success" ||
  //   user.votersCardVerificationStatus === "success";

  const idVerified =
    user.driversLicenseVerificationStatus === "success" ||
    user.ninSlipVerificationStatus === "success" ||
    user.internationalPassportVerificationStatus === "success" ||
    user.nationalIdVerificationStatus === "success" ||
    user.votersCardVerificationStatus === "success";

  return (
    <ScrollView style={styles.container}>
      <AppText size='16' style={[styles.mh10, { color: colors.light }]}>
        Here’s what you need to do to set up your your delivery personel’s
        account
      </AppText>

      <View style={{ marginVertical: 10 }}>
        <VerificationItem
          title='About you'
          onPress={() => {
            props.navigation.navigate("AddDriverDetailsScreen");
          }}
          uploaded={aboutMeVerified}
        />

        {/* <VerificationItem title='About Vehicle' subTitle='Start now' />
        <VerificationItem
          title='Driver’s License'
          subTitle='Start now'
          onPress={() => {
            props.navigation.navigate("UploadLicenseScreen");
          }}
          uploaded={user.driversLicense}
        /> */}
        <VerificationItem
          uploaded={idVerified}
          title='Government-issued photo ID'
          onPress={() => {
            props.navigation.navigate("UploadDocumentsScreen");
          }}
        />

        {/* <VerificationItem
          title='Valid Vehicle Isnurance Policy'
          subTitle='Start now'
          onPress={() => {
            props.navigation.navigate("UploadVehicleInsuranceScreen");
          }}
          uploaded={user.insurancePolicy}
        /> */}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  avatar: {
    width: 55,
    height: 55,

    borderRadius: 55 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSmall: {
    width: 20,
    height: 20,
    backgroundColor: colors.success,
    borderRadius: 20 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  bold: { fontWeight: "bold" },
  container: { padding: 16, backgroundColor: colors.white },
  mh10: { marginHorizontal: 10 },
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
  selectedTab: { backgroundColor: colors.primary },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 16,
    height: "100%",
    alignItems: "center",
  },
});
export default DriverSettingsScreen;

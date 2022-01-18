/** @format */

import React from "react";
import { View, StyleSheet, Image, useWindowDimensions } from "react-native";

import colors from "../config/colors";
import AppText from "./AppText";
import AppButton from "./AppButton";

function OnboardingScreenItem({ subTitle, title, image, tag, navigation }) {
  const { width, height } = useWindowDimensions();

  return (
    <View
      style={[styles.container, { height, paddingHorizontal: height * 0.05 }]}>
      <View style={styles.sectionOne}>
        <Image source={require("../assets/Log-x.png")} />
        {image}
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, tag === 1 && styles.activeDot]} />
          <View style={[styles.dot, tag === 2 && styles.activeDot]} />
          <View style={[styles.dot, tag === 3 && styles.activeDot]} />
        </View>
      </View>
      <View style={styles.sectionTwo}>
        <View style={styles.texts}>
          <AppText style={styles.mainText} size='medium'>
            {title}
          </AppText>
          <AppText style={styles.subText}>{subTitle}</AppText>
        </View>
        <View style={styles.buttons}>
          <AppButton
            title='Get started'
            style={{ marginTop: 30 }}
            fullWidth
            onPress={() => navigation.navigate("SignUp")}
          />
          <AppButton
            title='Log in to Log-X'
            fullWidth
            secondary
            onPress={() => navigation.navigate("LogIn")}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: colors.secondary,
  },
  buttons: {
    flex: 0.5,
    justifyContent: "flex-start",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    // flex: 1,
  },
  dot: {
    height: 6,
    width: 6,
    backgroundColor: colors.grey,
    borderRadius: 3,
    margin: 8,
  },
  dotsContainer: { flexDirection: "row" },
  mainText: {
    fontWeight: "bold",
    color: colors.secondary,
    marginTop: 16,
    textAlign: "center",
  },
  sectionOne: {
    flex: 0.6,
    // width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingTop: 50,
  },
  sectionTwo: {
    flex: 0.4,
    width: "100%",
    justifyContent: "flex-end",
  },
  subText: {
    fontWeight: "bold",
    color: colors.light,
    marginTop: 8,
    textAlign: "center",
  },
  texts: {
    flex: 0.5,
    width: "100%",
    justifyContent: "flex-start",
  },
});
export default OnboardingScreenItem;

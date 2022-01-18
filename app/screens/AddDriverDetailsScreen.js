/** @format */

import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";

function AddDriverDetailsScreen(props) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <AppText size='header' style={[styles.mb16]}>
          Add your details
        </AppText>

        <AppTextInput title='First Name' />
        <AppTextInput title='Last Name' />
        <AppTextInput title='Home Address' />
        <AppTextInput title='Category' />
        <AppTextInput
          title='Phone Number'
          keyboardType='number-pad'
          returnKeyType='done'
        />
        <AppTextInput title='Location' />

        <AppButton
          title='Done'
          fullWidth
          style={[styles.mtAuto]}
          onPress={() => {
            props.navigation.goBack();
          }}
        />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  container: {
    padding: 16,
    backgroundColor: colors.white,
  },
  fs18: { fontSize: 18 },
  light: { color: colors.light },
  mb16: { marginBottom: 16 },
  mb32: { marginBottom: 32 },
  mh16: { marginHorizontal: 16 },
  mv16: { marginVertical: 16 },
  mtAuto: { marginTop: "auto" },
  primary: { color: colors.primary },

  fs16: { fontSize: 16 },
  jANdACenter: { justifyContent: "center", alignItems: "center" },
  mv10: { marginVertical: 10 },
  secondary: { color: colors.secondary },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 20,
  },
});
export default AddDriverDetailsScreen;

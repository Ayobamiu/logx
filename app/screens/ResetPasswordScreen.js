/** @format */

import React, { useContext, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import * as Yup from "yup";
import { Formik } from "formik";
import authApi from "../api/auth";
import showToast from "../config/showToast";
const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});
function ResetPasswordScreen(props) {
  const [loading, setLoading] = useState(false);

  return (
    <Formik
      initialValues={{}}
      onSubmit={async (values) => {
        setLoading(true);
        const { data, error } = await authApi.changePassword({
          ...values,
        });
        setLoading(false);
        if (error) {
          showToast("Error reseting password");
        }
        if (!error && data) {
          showToast("Password changed succesfully");
          props.navigation.navigate("LogIn");
        }
      }}
      validationSchema={validationSchema}>
      {({ handleChange, handleBlur, handleSubmit, errors }) => (
        <View style={styles.container}>
          <AppText size='header' style={[styles.mb16]}>
            Create new Password
            <ActivityIndicator animating={loading} color={colors.primary} />
          </AppText>
          <AppText style={[styles.light, styles.mb32]}>
            Create a new password for your account
          </AppText>
          <AppTextInput
            title='Email Address'
            keyboardType='email-address'
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            autoCapitalize='none'
            textContentType='emailAddress'
            autoCompleteType='email'
          />
          <AppText style={[{ color: colors.danger }, styles.mb32]}>
            {errors.email}
          </AppText>
          <AppTextInput
            title='Password'
            secureTextEntry
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            textContentType='password'
            autoCompleteType='password'
            autoCapitalize='none'
          />
          <AppText style={[{ color: colors.danger }, styles.mb32]}>
            {errors.password}
          </AppText>

          <AppButton
            title='Proceed'
            fullWidth
            style={[styles.mtAuto]}
            onPress={handleSubmit}
            disabled={loading}
          />
        </View>
      )}
    </Formik>
  );
}
const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
    paddingBottom: 32,
  },
  fs18: { fontSize: 18 },
  light: { color: colors.light },
  mb16: { marginBottom: 16 },
  mb32: { marginBottom: 32 },
  mh16: { marginHorizontal: 16 },
  mtAuto: { marginTop: "auto" },
  primary: { color: colors.primary },
});
export default ResetPasswordScreen;

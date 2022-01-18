/** @format */

import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import * as Yup from "yup";
import useAuth from "../auth/useAuth";
import { Formik } from "formik";
const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
});
function ForgotPasswordScreen(props) {
  const { saveAndSendResetPassworCode, sendingCode } = useAuth();

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <AppText
          style={[styles.bold, styles.fs18, styles.mh16, styles.primary]}
          onPress={() => props.navigation.navigate("SignUp")}>
          Get started
        </AppText>
      ),
    });
  });

  return (
    <Formik
      initialValues={{}}
      onSubmit={async (values) => {
        const newCode = await saveAndSendResetPassworCode(values.email);
        if (newCode) {
          props.navigation.navigate("ConfirmResetPasswordCode");
        }
      }}
      validationSchema={validationSchema}>
      {({ handleChange, handleBlur, handleSubmit, errors }) => (
        <View style={styles.container}>
          <AppText size='header' style={[styles.mb16]}>
            Forgot Passowrd
            <ActivityIndicator animating={sendingCode} color={colors.primary} />
          </AppText>
          <AppText style={[styles.light, styles.mb32]}>
            Fill your email address and a password reset code will be sent to
            it.
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

          <AppButton
            title='Proceed'
            fullWidth
            style={[styles.mtAuto]}
            onPress={handleSubmit}
            disabled={sendingCode}
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
export default ForgotPasswordScreen;

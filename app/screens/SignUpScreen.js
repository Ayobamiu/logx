/** @format */

import React, { useState } from "react";
import { StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import { Formik } from "formik";
import * as Yup from "yup";
import useAuth from "../auth/useAuth";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  phoneNumber: Yup.string()
    .required()
    .matches(phoneRegExp, "Phone number is not valid")
    .min(8),
});

function SignUpScreen(props) {
  const { saveAndSendCode, sendingCode } = useAuth();
  const [loading, setLoading] = useState(false);
  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <AppText
          style={[styles.bold, styles.fs18, styles.mh16, styles.primary]}
          onPress={() => props.navigation.navigate("LogIn")}>
          Login
        </AppText>
      ),
    });
  });
  return (
    <Formik
      initialValues={{ email: "", phoneNumber: "" }}
      onSubmit={async (values) => {
        // setLoading(true);
        const code = await saveAndSendCode(values.email);

        // setLoading(false);
        if (code) {
          props.navigation.navigate("Verify Number", values);
        }
      }}
      validationSchema={validationSchema}>
      {({ handleChange, handleBlur, handleSubmit, errors }) => (
        <ScrollView style={styles.container}>
          <AppText size='header' style={[styles.mb16]}>
            Create an account{" "}
            <ActivityIndicator animating={sendingCode} color={colors.primary} />
          </AppText>
          <AppText style={[styles.light, styles.mb32]}>
            Hi, welcome, fill in your details
          </AppText>
          <AppTextInput
            title='Phone Number'
            keyboardType='number-pad'
            returnKeyType='done'
            onChangeText={handleChange("phoneNumber")}
            onBlur={handleBlur("phoneNumber")}
            textContentType='telephoneNumber'
            autoCompleteType='tel'
          />
          <AppText style={[{ color: colors.danger }, styles.mb32]}>
            {errors.phoneNumber}
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
            title='Get started'
            fullWidth
            style={[styles.mtAuto]}
            onPress={handleSubmit}
            disabled={sendingCode}
          />
        </ScrollView>
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
export default SignUpScreen;

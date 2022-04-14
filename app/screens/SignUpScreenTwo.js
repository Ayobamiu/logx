/** @format */

import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import { Formik } from "formik";
import * as Yup from "yup";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import showToast from "../config/showToast";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required().label("First Name"),
  lastName: Yup.string().required().label("Last Name"),
  password: Yup.string().required().min(8).label("Password"),
});

function SignUpScreenTwo(props) {
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
  const param = props.route.params;

  const [loading, setLoading] = useState(false);
  const { logIn } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        initialValues={{}}
        onSubmit={async (values) => {
          setLoading(true);
          const result = await authApi
            .signUp({
              ...values,
              ...param,
            })
            .catch((error) => {});

          if (result.error) {
            setLoading(false);
            return showToast(result.message);
          }

          setLoading(false);
          logIn(result.data);
        }}
        validationSchema={validationSchema}>
        {({ handleChange, handleBlur, handleSubmit, errors }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
            style={{ flex: 1 }}>
            <AppText size='header' style={[styles.mb16]}>
              Set up your account{" "}
              <ActivityIndicator animating={loading} color={colors.primary} />
            </AppText>
            <AppText style={[styles.light, styles.mb32]}>
              Hi, welcome, fill in your details
            </AppText>
            <AppTextInput
              title='First Name'
              onChangeText={handleChange("firstName")}
              onBlur={handleBlur("firstName")}
              textContentType='givenName'
              autoCompleteType='name'
            />
            <AppText style={[{ color: colors.danger }, styles.mb16]}>
              {errors.firstName}
            </AppText>
            <AppTextInput
              title='Last Name'
              onChangeText={handleChange("lastName")}
              onBlur={handleBlur("lastName")}
              textContentType='name'
              autoCompleteType='name'
            />
            <AppText style={[{ color: colors.danger }, styles.mb16]}>
              {errors.lastName}
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
            <AppText style={[{ color: colors.danger }, styles.mb16]}>
              {errors.password}
            </AppText>
            <AppButton
              title='Set up your account'
              fullWidth
              style={[styles.mtAuto]}
              onPress={handleSubmit}
              disabled={loading}
            />
          </KeyboardAvoidingView>
        )}
      </Formik>
    </ScrollView>
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
export default SignUpScreenTwo;

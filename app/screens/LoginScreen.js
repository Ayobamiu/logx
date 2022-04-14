/** @format */

import React, { useContext, useState } from "react";
import { StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import AuthContext from "../contexts/auth";
import * as Yup from "yup";
import useAuth from "../auth/useAuth";
import authApi from "../api/auth";
import showToast from "../config/showToast";
import { Formik } from "formik";
const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});
function LoginScreen(props) {
  const [loading, setLoading] = useState(false);
  const { logIn } = useAuth();
  const handleLogIn = async ({ email, password }) => {
    setLoading(true);
    const result = await authApi.login(email, password);

    if (result.data && result.data.error) {
      setLoading(false);
      return showToast(result.data.message);
    }
    if (result.error) {
      setLoading(false);
      return showToast(result.message);
    }
    setLoading(false);
    logIn(result.data);
  };
  const { user, setUser } = useContext(AuthContext);
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
        handleLogIn({ ...values });
      }}
      validationSchema={validationSchema}>
      {({ handleChange, handleBlur, handleSubmit, errors }) => (
        <ScrollView style={styles.container}>
          <AppText size='header' style={[styles.mb16]}>
            Login{" "}
            <ActivityIndicator animating={loading} color={colors.primary} />
          </AppText>
          <AppText style={[styles.light, styles.mb32]}>
            Need a new account?
            <AppText
              style={[styles.bold, { color: colors.primary }]}
              onPress={() => props.navigation.navigate("SignUp")}>
              {" "}
              Create an account
            </AppText>
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
            title='Sign in'
            fullWidth
            style={[styles.mtAuto]}
            onPress={handleSubmit}
            disabled={loading}
          />
          <AppButton
            title='Forgot password'
            fullWidth
            onPress={() => props.navigation.navigate("ForgotPasswordScreen")}
            disabled={loading}
            secondary
          />
        </ScrollView>
      )}
    </Formik>
  );
}
const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  container: {
    // flex: 1,
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
export default LoginScreen;

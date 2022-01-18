/** @format */

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignUpScreen from "../screens/SignUpScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import colors from "../config/colors";
import VerifyNumber from "../screens/VerifyNumber";
import SignUpScreenTwo from "../screens/SignUpScreenTwo";
import LoginScreen from "../screens/LoginScreen";
import EnablePushNotification from "../screens/EnablePushNotification";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ConfirmResetPasswordCode from "../screens/ConfirmResetPasswordCode";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
          elevation: 0,
        },
      }}>
      <Stack.Screen
        name='Onboarding'
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='SignUp'
        component={SignUpScreen}
        options={{ title: "" }}
      />
      <Stack.Screen
        name='Sign Up Two'
        component={SignUpScreenTwo}
        options={{ title: "" }}
      />
      <Stack.Screen
        name='LogIn'
        component={LoginScreen}
        options={{ title: "" }}
      />
      <Stack.Screen
        name='ForgotPasswordScreen'
        component={ForgotPasswordScreen}
        options={{ title: "" }}
      />
      <Stack.Screen
        name='ConfirmResetPasswordCode'
        component={ConfirmResetPasswordCode}
        options={{ title: "" }}
      />
      <Stack.Screen
        name='ResetPasswordScreen'
        component={ResetPasswordScreen}
        options={{ title: "" }}
      />
      <Stack.Screen
        name='Verify Number'
        component={VerifyNumber}
        options={{ title: "" }}
      />
      <Stack.Screen
        name='Enable Push Notification'
        component={EnablePushNotification}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
export default AuthNavigator;

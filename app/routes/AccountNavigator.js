/** @format */

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import colors from "../config/colors";
import AccontScreen from "../screens/AccontScreen";

const Stack = createStackNavigator();

function AccountNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
          elevation: 0,
        },
      }}>
      <Stack.Screen
        name='AccontScreen'
        component={AccontScreen}
        options={{ title: "Account" }}
      />
    </Stack.Navigator>
  );
}
export default AccountNavigator;

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import VerificationScreen from "../screens/VerificationScreen";

const Stack = createStackNavigator();

function VerificationNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
    </Stack.Navigator>
  );
}
export default VerificationNavigator;

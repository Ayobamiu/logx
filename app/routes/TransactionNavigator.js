import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import colors from "../config/colors";
import TransactionsScreen from "../screens/TransactionsScreen";
import TransactionDetailsScreen from "../screens/TransactionDetailsScreen";
import ChatScreen from "../screens/ChatScreen";
import TransactionTimer from "../screens/TransactionTimer";

const Stack = createStackNavigator();

function TransactionNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
          elevation: 0,
        },
      }}
    >
      <Stack.Screen
        name="TransactionsScreen"
        component={TransactionsScreen}
        options={{ title: "Transactions" }}
      />
      <Stack.Screen
        name="TransactionDetailsScreen"
        component={TransactionDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen
        name="TransactionTimer"
        component={TransactionTimer}
        options={{ title: "Timer" }}
      />
    </Stack.Navigator>
  );
}
export default TransactionNavigator;

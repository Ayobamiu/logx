/** @format */

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Feather } from "@expo/vector-icons";
import colors from "../config/colors";
import HomeNavigator from "./HomeNavigator";
import TransactionNavigator from "./TransactionNavigator";
import AccountNavigator from "./AccountNavigator";
import useNotification from "../hooks/useNotification";

const Tab = createBottomTabNavigator();

function TabNavigator(props) {
  useNotification();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "gray",
      }}>
      <Tab.Screen
        name='Home'
        component={HomeNavigator}
        options={({ route }) => ({
          tabBarIcon: ({ size, color }) => (
            <Feather name='home' size={size} color={color} />
          ),
          headerShown: false,
        })}
      />

      <Tab.Screen
        name='Transactions'
        component={TransactionNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name='ios-calculator-outline' size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name='Account'
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Feather name='user' size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;

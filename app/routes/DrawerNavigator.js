import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "./TabNavigator";
import CustomDrawerContent from "./CustomDrawerContent";
import VerificationNavigator from "./VerificationNavigator";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={TabNavigator} />
      <Drawer.Screen
        name="VerificationNavigator"
        component={VerificationNavigator}
      />
    </Drawer.Navigator>
  );
}

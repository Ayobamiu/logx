/** @format */

import React, { useContext } from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { ImageBackground, Pressable, View, ScrollView } from "react-native";
import {
  Ionicons,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  Fontisto,
} from "@expo/vector-icons";
import AppText from "../components/AppText";
import colors from "../config/colors";
import AuthContext from "../contexts/auth";
import useAuth from "../auth/useAuth";
import ModeContext from "../contexts/mode";

function CustomDrawerContent(props) {
  const { user } = useContext(AuthContext);
  const { mode, setMode } = useContext(ModeContext);
  const { logOut, changeUserMode } = useAuth();
  let verified = 0;
  if (user.verificationPhoto) {
    verified += 1;
  }
  if (user.nationalId || user.votersCard || user.internationalPassport) {
    verified += 1;
  }
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ justifyContent: "space-between", flex: 1 }}>
      <ScrollView>
        <View>
          <Pressable
            style={{
              borderBottomColor: colors.light,
              borderBottomWidth: 1,
              padding: 16,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
            onPress={() => props.navigation.navigate("Account")}>
            <ImageBackground
              source={{ uri: user.profilePhoto }}
              style={{
                width: 55,
                height: 55,
                backgroundColor: colors.grey,
                borderRadius: 55 / 2,
                alignItems: "center",
                justifyContent: "center",
              }}
              borderRadius={55 / 2}>
              {!user.profilePhoto && (
                <Feather color={colors.black} size={40} name='user' />
              )}
            </ImageBackground>
            <View style={{ marginHorizontal: 10 }}>
              <AppText style={{ color: colors.black, fontWeight: "bold" }}>
                {user.firstName}
              </AppText>
              <AppText style={{ color: colors.light }}>User</AppText>
            </View>
            <Fontisto
              name='angle-right'
              size={15}
              color={colors.primary}
              style={{ marginLeft: "auto" }}
            />
          </Pressable>
          <DrawerItem
            label='Account'
            onPress={() => props.navigation.navigate("Account")}
            icon={({ focused, color, size }) => (
              <Feather color={color} size={size} name='user' />
            )}
          />
          <DrawerItem
            label='Transaction History'
            onPress={() => props.navigation.navigate("Transactions")}
            icon={({ focused, color, size }) => (
              <Ionicons
                color={color}
                size={size}
                name={focused ? "flag" : "flag-outline"}
              />
            )}
          />
          <DrawerItem
            label={({ focused, color }) => (
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}>
                <AppText style={{ color, fontWeight: "500" }}>
                  Verfication
                </AppText>
                <AppText style={{ color: colors.light }}>
                  {verified}/2{" "}
                  {verified === 0 && (
                    <Ionicons
                      color={colors.danger}
                      size={15}
                      name='alert-circle-outline'
                      style={{ marginLeft: 16 }}
                    />
                  )}
                  {verified === 1 && (
                    <Ionicons
                      color={colors.warning}
                      size={15}
                      name='alert-circle-outline'
                      style={{ marginLeft: 16 }}
                    />
                  )}
                  {verified === 2 && (
                    <Ionicons
                      color={colors.success}
                      size={15}
                      name='checkmark-circle'
                      style={{ marginLeft: 16 }}
                    />
                  )}
                </AppText>
              </View>
            )}
            onPress={() => props.navigation.navigate("VerificationScreen")}
            icon={({ focused, color, size }) => (
              <Ionicons
                color={color}
                size={size}
                name={focused ? "flag" : "flag-outline"}
              />
            )}
          />
          <DrawerItem
            label='Safety and Security'
            onPress={() => props.navigation.navigate("SafetyAndSecurityScreen")}
            icon={({ focused, color, size }) => (
              <Ionicons
                color={color}
                size={size}
                name={focused ? "ios-shield" : "ios-shield-outline"}
              />
            )}
          />
          <DrawerItem
            label='My wallet and Earnings'
            onPress={() => props.navigation.navigate("MyEarningsScreen")}
            icon={({ focused, color, size }) => (
              <Ionicons
                color={color}
                size={size}
                name={focused ? "wallet" : "wallet-outline"}
              />
            )}
          />
          <DrawerItem
            label='Reviews and Ratings'
            onPress={() => props.navigation.navigate("ReviewsScreen")}
            icon={({ focused, color, size }) => (
              <Ionicons
                color={color}
                size={size}
                name={focused ? "chatbox" : "chatbox-outline"}
              />
            )}
          />
          <DrawerItem
            label='Settings'
            onPress={() => props.navigation.navigate("DriverSettingsScreen")}
            icon={({ focused, color, size }) => (
              <MaterialCommunityIcons
                name='cog-outline'
                color={color}
                size={size}
              />
            )}
          />
          <DrawerItem
            label='Sign Out'
            onPress={async () => await logOut()}
            icon={({ focused, color, size }) => (
              <FontAwesome name='sign-out' color={color} size={size} />
            )}
          />
        </View>
        <View style={{ width: "100%" }}>
          <Pressable
            style={{
              backgroundColor: colors.primary,
              borderRadius: 100,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              padding: 16,
              paddingHorizontal: 16,
              margin: 32,
            }}
            onPress={() => {
              if (mode === "driver") {
                changeUserMode("sender");
              } else {
                changeUserMode("driver");
              }
              props.navigation.closeDrawer();
            }}>
            <AppText style={{ color: colors.white }}>
              {mode === "driver" ? "Switch to Sender" : "Start Delivering"}
            </AppText>
            <Ionicons
              name='arrow-forward'
              style={{ marginLeft: 10 }}
              color={colors.white}
            />
          </Pressable>
          <View
            style={{
              borderTopColor: colors.light,
              borderTopWidth: 1,
              height: 69,
              paddingHorizontal: 16,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}>
            <AppText
              style={{ color: colors.black, fontWeight: "bold" }}
              onPress={() => props.navigation.navigate("LegalScreen")}>
              Legal
            </AppText>
            <AppText style={{ color: colors.light }}>V 1.1.01</AppText>
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </DrawerContentScrollView>
  );
}
export default CustomDrawerContent;

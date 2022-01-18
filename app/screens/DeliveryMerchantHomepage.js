/** @format */

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Switch,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ImageBackground,
} from "react-native";
import { Feather, Fontisto, FontAwesome5 } from "@expo/vector-icons";

import AuthContext from "../contexts/auth";
import colors from "../config/colors";
import AppText from "../components/AppText";
import Group608 from "../assets/Group608.svg";
import placesApi from "../api/places";
import TripRequestsContext from "../contexts/tripRequests";
import useLocation from "../hooks/useLocation";
import DriverRequestPreview from "../components/DriverRequestPreview";
import OnlineStatusContext from "../contexts/onlineStatus";
import useAuth from "../auth/useAuth";
import socket from "../api/socket";
import AppButton from "../components/AppButton";
import useTrips from "../hooks/useTrips";

function DeliveryMerchantHomepage(props) {
  const { user } = useContext(AuthContext);
  const { tripRequests, setTripRequests } = useContext(TripRequestsContext);

  const { isOnline } = useContext(OnlineStatusContext);
  const { loadTrips, loadingtrips } = useTrips();
  const { changeUserOnlineStatus } = useAuth();

  const [refreshing, setRefreshing] = useState(false);

  // useEffect(() => {
  //   loadTrips();
  // }, []);
  // useEffect(() => {
  //   socket.on("trip:created", () => {
  //     // loadTrips();
  //   });
  // }, []);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    (async () => {
      await loadTrips();
      setRefreshing(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.userDetails}>
        <Pressable
          onPress={() => {
            props.navigation.openDrawer();
          }}>
          <ImageBackground
            source={{ uri: user.profilePhoto }}
            style={{
              width: 32,
              height: 32,
              justifyContent: "center",
              alignItems: "center",
            }}
            borderRadius={32 / 2}>
            {!user.profilePhoto && (
              <Feather name='user' size={30} color={colors.black} />
            )}
          </ImageBackground>
        </Pressable>
        <View style={[styles.switchCase, styles.row]}>
          <AppText
            size='medium'
            style={[styles.black, styles.bold, styles.mh16]}>
            {isOnline ? "Online" : "Offline"}
          </AppText>
          <Switch
            thumbColor={colors.primary}
            trackColor={{
              false: colors.grey,
              true: colors.primary,
            }}
            thumbColor={isOnline ? colors.white : "#f4f3f4"}
            ios_backgroundColor='#3e3e3e'
            onValueChange={() => {
              changeUserOnlineStatus(!isOnline);
              if (socket.connected) {
                socket.disconnect();
              } else {
                socket.connect();
              }
            }}
            value={isOnline}
          />
        </View>

        <Feather
          name='bell'
          size={30}
          color={colors.black}
          onPress={() => {
            props.navigation.navigate("NotificationsScreen");
          }}
        />
      </View>

      <View style={[styles.row]}>
        <AppText size='header' style={[styles.black, styles.bold, styles.mv16]}>
          Hi, {user.firstName}
        </AppText>
        {socket.connected && <View style={styles.online} />}
        {socket.disconnected && <View style={styles.offline} />}
      </View>
      <ActivityIndicator animating={loadingtrips} color={colors.primary} />

      {isOnline ? (
        <FlatList
          data={tripRequests}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={
            <AppText size='16' style={[styles.black]}>
              You have {tripRequests.length} requests today.
            </AppText>
          }
          ListEmptyComponent={
            <View
              style={[
                {
                  justifyContent: "center",
                  alignItems: "center",
                  height: 300,
                },
                styles.mv8,
              ]}>
              <ActivityIndicator
                animating={loadingtrips}
                color={colors.primary}
              />
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <FontAwesome5
                  name='car-side'
                  size={24}
                  color='black'
                  style={styles.mv8}
                />
                <AppText style={styles.mv8}>
                  Trip requests will Appear Here
                </AppText>
              </View>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => <DriverRequestPreview requestItem={item} />}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <AppText size='16' style={[{ color: colors.danger }, styles.mv16]}>
            {`You are currently offline. Go online to start\naccepting jobs`}
          </AppText>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 16,
            }}>
            <Group608 />
            <AppText
              style={[styles.light, styles.mv16, { textAlign: "center" }]}>
              Hello {user.firstName}, you have no deivery requests at the
              moment. check the markets for availabe deals around you.
            </AppText>
          </View>
        </View>
      )}

      <View style={[styles.floatActionButton]}>
        <Pressable
          style={[
            styles.row,
            {
              padding: 16,
              backgroundColor: colors.primary,
              justifyContent: "center",
              borderRadius: 100,
            },
          ]}
          onPress={() => props.navigation.navigate("MarketScreen")}>
          <AppText style={{ color: colors.white }}>Go to market</AppText>
          <Fontisto
            name='arrow-right'
            size={16}
            color={colors.white}
            style={[styles.ml10]}
          />
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    backgroundColor: colors.greyBg,
    justifyContent: "center",
  },
  bigAvatar: {
    alignItems: "center",
    width: 47,
    height: 47,
    borderRadius: 47 / 2,
    backgroundColor: colors.secondary,
    justifyContent: "center",
  },
  black: { color: colors.black },
  bold: { fontWeight: "bold" },
  borderBottom: { borderBottomColor: colors.light, borderBottomWidth: 1 },
  brad: { borderRadius: 12, overflow: "hidden" },
  buttons: { height: 50 },
  close: { width: 58, height: 4, backgroundColor: colors.light },
  container: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 16,
    paddingVertical: 32,
  },
  driverItem: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    overflow: "hidden",
  },
  driverGrey: { backgroundColor: colors.inputGray, padding: 16 },
  driverWhite: { backgroundColor: colors.white, padding: 16 },
  floatActionButton: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    paddingHorizontal: 16,
    width: "100%",
  },
  joined: {
    color: colors.success,
    backgroundColor: "rgba(76, 217, 100, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  light: { color: colors.light },
  mlAuto: { marginLeft: "auto" },
  ml10: { marginLeft: 10 },
  mt4: { marginTop: 4 },

  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  mh8: { marginHorizontal: 8 },
  mh16: { marginHorizontal: 16 },
  mr16: { marginRight: 16 },
  mv8: { marginVertical: 8 },
  mv16: { marginVertical: 16 },
  profileSection: {
    height: 163,
    backgroundColor: colors.inputGray,
    alignItems: "center",
    padding: 16,
  },
  userDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  offline: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: colors.warning,
  },
  online: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: colors.success,
  },
  switchCase: {},
  waiting: {
    color: colors.primary,
    backgroundColor: colors.lightPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
export default DeliveryMerchantHomepage;

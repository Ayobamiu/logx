/** @format */

import React, { useContext, useEffect, useState } from "react";

import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Modal,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import AppText from "../components/AppText";
import colors from "../config/colors";
import { Ionicons, Feather, FontAwesome5 } from "@expo/vector-icons";
import AuthContext from "../contexts/auth";
import SectionHeader from "../components/SectionHeader";
import TransactionItem from "../components/TransactionItem";
import QuickActonItem from "../components/QuickActionItem";
import AppButton from "../components/AppButton";
import TripsContext from "../contexts/trips";
import placesApi from "../api/places";
import TripContext from "../contexts/trip";
import PayWithFlutterWave from "../components/PayWithFlutterWave";
import useAuth from "../auth/useAuth";
import ModeContext from "../contexts/mode";

function HomeScreen(props) {
  const { user } = useContext(AuthContext);
  const { trip, setTrip } = useContext(TripContext);
  const { trips, setTrips } = useContext(TripsContext);
  const ongoingTrips = trips.filter(
    (i) => i.status === "pending" || i.status === "inTransit"
  );
  const { changeUserMode } = useAuth();
  const { mode, setMode } = useContext(ModeContext);

  const width = Dimensions.get("window").width;

  const [expandWhiteSection, setExpandWhiteSection] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [loadingtrips, setLoadingtrips] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [openPayment, setOpenPayment] = useState(false);

  const loadTrips = async () => {
    setLoadingtrips(true);

    const { data, error } = await placesApi.getMyTrip();
    if (!error && data) {
      setTrips(data);
    }
    setLoadingtrips(false);
  };
  useEffect(() => {
    loadTrips();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    (async () => {
      await loadTrips();
      setRefreshing(false);
    })();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={[styles.blueSection]}>
          <View style={styles.userDetails}>
            <Pressable
              onPress={() => {
                props.navigation.openDrawer();
              }}
              style={styles.userDetailsTwo}>
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
                  <Feather name='user' size={30} color={colors.white} />
                )}
              </ImageBackground>
              {!expandWhiteSection && (
                <AppText style={{ color: colors.white, marginLeft: 10 }}>
                  Hi, {user.firstName}{" "}
                  <ActivityIndicator
                    animating={loadingtrips}
                    color={colors.primary}
                  />
                </AppText>
              )}
            </Pressable>
            {expandWhiteSection && (
              <AppText
                size='medium'
                style={{ color: colors.white, fontWeight: "bold" }}>
                Log-X
              </AppText>
            )}
            <Feather
              name='bell'
              size={30}
              color={colors.white}
              onPress={() => {
                props.navigation.navigate("NotificationsScreen");
              }}
            />
          </View>
          <View
            style={{
              paddingHorizontal: width * 0.1,
              justifyContent: "center",
              height: 150,
            }}>
            <AppText
              size='16'
              style={{
                color: colors.primary,
                textAlign: "center",
                lineHeight: 21,
              }}>
              Welcome {user.firstName}, its a good day to send your packages to
              your respective destinations.
            </AppText>
            <AppText
              size='16'
              style={{
                color: colors.lightPrimary,
                textAlign: "center",
                lineHeight: 21,
                marginVertical: 10,
              }}
              onPress={() => {
                if (mode === "driver") {
                  changeUserMode("sender");
                } else {
                  changeUserMode("driver");
                }
                props.navigation.closeDrawer();
              }}>
              Want to deliver for people? Let’s Roll
            </AppText>
          </View>
        </View>

        <View style={[styles.whiteSection]}>
          <Pressable
            style={styles.drawerBox}
            onPress={() => setExpandWhiteSection(!expandWhiteSection)}>
            <View style={styles.closeDrawer} />
          </Pressable>
          <View style={{ paddingHorizontal: width * 0.05 }}>
            <Pressable
              onPress={() => {
                props.navigation.navigate("MyEarningsScreen");
              }}
              style={styles.yellowBox}>
              <AppText size='header'>
                &#8358;{user.availableBalance}
                <AppText size='x-small' style={{ color: colors.white }}>
                  NGN
                </AppText>
              </AppText>

              <TouchableOpacity
                onPress={() => {
                  setOpenPayment(true);
                }}
                style={{
                  width: 100,
                  backgroundColor: colors.white,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}>
                <Feather name='plus' size={15} color={colors.primary} />
                <AppText style={styles.primary}>Add Fund</AppText>
              </TouchableOpacity>
            </Pressable>

            <SectionHeader
              headerText='Ongoing transactions'
              buttonText='More'
              onPress={() => props.navigation.navigate("Transactions")}
            />

            {ongoingTrips.length === 0 && (
              <View
                style={[
                  { justifyContent: "center", alignItems: "center" },
                  styles.mv10,
                ]}>
                <FontAwesome5 name='car-side' size={24} color='black' />
                <AppText style={styles.mv10}>
                  You Ongoing Trips will Appear Here
                </AppText>
              </View>
            )}
            {ongoingTrips.slice(0, 3).map((tripItem, index) => (
              <TransactionItem
                item={tripItem}
                key={index}
                onPress={() => {
                  setTrip(tripItem);
                  props.navigation.navigate("TransactionDetailsScreen", {
                    item: tripItem,
                  });
                }}
              />
            ))}
            <SectionHeader headerText='Quick Actions' />
            <QuickActonItem
              onPress={() => props.navigation.navigate("Transactions")}
            />
          </View>
        </View>

        <Modal visible={showRequestModal} transparent>
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              width: "100%",
              height: "100%",
            }}>
            <Pressable
              style={{ flex: 0.5, flexGrow: 1 }}
              onPress={() => setShowRequestModal(false)}
            />
            <View
              style={{
                flex: 0.5,
                width: "100%",
                borderTopRightRadius: 15,
                borderTopLeftRadius: 16,
                backgroundColor: colors.white,
                padding: 32,
                flexShrink: 1,
              }}>
              {showCancelPrompt ? (
                <View>
                  <AppText size='medium'>Confirmation</AppText>
                  <AppText style={styles.mv10}>
                    Are you sure you want to cancel?
                  </AppText>
                  <View
                    style={[
                      styles.row,
                      {
                        width: "100%",
                        // justifyContent: "space-between",
                        marginTop: 30,
                      },
                    ]}>
                    <AppButton
                      title='No, Go back'
                      secondary
                      style={{
                        borderColor: colors.black,
                        borderWidth: 1,
                        // paddingHorizontal: 30,
                        marginRight: 20,
                      }}
                      onPress={() => setShowCancelPrompt(false)}
                    />
                    <AppButton
                      title='Yes, Cancel'
                      style={
                        {
                          // paddingHorizontal: 30,
                        }
                      }
                      onPress={() => setShowRequestModal(false)}
                    />
                  </View>
                </View>
              ) : (
                <View>
                  <AppText size='medium'>Delivery Request</AppText>
                  <AppText style={styles.mv10}>
                    You have been invited as a receiver to this transaction by
                    <AppText style={[styles.bold]}> Adekola Oluwatobi</AppText>
                  </AppText>
                  <View
                    style={[
                      styles.row,
                      {
                        width: "100%",
                        // justifyContent: "space-between",
                        marginTop: 30,
                      },
                    ]}>
                    <AppButton
                      title='Cancel'
                      secondary
                      style={{
                        borderColor: colors.black,
                        borderWidth: 1,
                        // paddingHorizontal: 30,
                        marginRight: 20,
                      }}
                      onPress={() => setShowCancelPrompt(true)}
                    />
                    <AppButton
                      title='Join now'
                      style={
                        {
                          // paddingHorizontal: 30,
                        }
                      }
                      onPress={() => setShowRequestModal(false)}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
      <View style={styles.bottom}>
        <AppButton
          fullWidth
          title='Send a Package'
          whiteText
          Icon={
            <Ionicons
              name='arrow-forward'
              color={colors.white}
              size={16}
              style={{ marginHorizontal: 16 }}
            />
          }
          // onPress={() => props.navigation.navigate("EnterLocationScreen")}
          onPress={() => props.navigation.navigate("SelectJourneyType")}
        />
      </View>

      <PayWithFlutterWave
        visible={openPayment}
        toggleModal={() => setOpenPayment(false)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  blueSection: { backgroundColor: colors.secondary },
  bold: { fontWeight: "bold" },
  bottom: {
    position: "absolute",
    bottom: 16,
    width: "100%",
    padding: 16,
    paddingHorizontal: 32,
  },
  closeDrawer: {
    height: 4,
    width: 54,
    backgroundColor: colors.grey,
    borderRadius: 8,
  },
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    height: Dimensions.get("screen").height,
  },
  drawerBox: {
    height: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  greyBox: {
    width: "100%",
    height: 50,
    backgroundColor: colors.inputGray,
    borderRadius: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  mv10: { marginVertical: 10 },
  primary: { color: colors.primary },
  row: { flexDirection: "row", alignItems: "center" },
  userDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 32,
  },
  userDetailsTwo: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  whiteSection: {
    backgroundColor: colors.white,
    // flex: 1,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    // position: "absolute",
    // bottom: 0,
    width: "100%",
    // flex: 1,
    paddingBottom: 30,
    alignSelf: "center",
    minHeight: 600,
  },
  yellowBox: {
    width: "100%",
    height: 100,
    backgroundColor: colors.primary,
    borderRadius: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
  },
});
export default HomeScreen;

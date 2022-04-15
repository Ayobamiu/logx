/** @format */

import React, { useContext, useEffect, useState } from "react";

import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  Platform,
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
import authApi from "../api/auth";
import placesApi from "../api/places";
import TripContext from "../contexts/trip";
import SelectJorneyTypeAnyWhere from "../components/SelectJorneyTypeAnyWhere";
import PayWithFlutterWave from "../components/PayWithFlutterWave";
import useAuth from "../auth/useAuth";
import ModeContext from "../contexts/mode";
import AppUserAvatar from "../components/AppUserAvatar";
import showToast from "../config/showToast";
import socket from "../api/socket";
import NotificationContext from "../contexts/notifications";

function HomeScreen(props) {
  let mounted = true;
  const { user, setUser } = useContext(AuthContext);
  const { trip, setTrip } = useContext(TripContext);
  const { trips, setTrips } = useContext(TripsContext);
  const { notifications } = useContext(NotificationContext);
  const unreadNotifications = notifications.filter((i) => !i.seen);

  const ongoingTrips = trips.filter(
    (i) => i.status === "pending" || i.status === "inTransit"
  );
  const { changeUserMode, saveUser } = useAuth();
  const { mode, setMode } = useContext(ModeContext);

  const width = Dimensions.get("window").width;

  const [expandWhiteSection, setExpandWhiteSection] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [loadingtrips, setLoadingtrips] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openJourneyTypePanel, setOpenJourneyTypePanel] = useState(false);

  const loadTrips = async () => {
    if (mounted) {
      setLoadingtrips(true);
    }

    const { data, error } = await placesApi.getMyTrip();
    if (!error && data) {
      if (mounted) {
        setTrips(data);
      }
    }
    if (mounted) {
      setLoadingtrips(false);
    }
  };
  const handleUpdateProfile = async (data) => {
    const result = await authApi.updateProfile(data);

    if (result.data && result.data.error) {
      return showToast("Profile not up to date, Reload");
    }
    if (result.error) {
      return showToast("Profile not up to date, Reload");
    }
    setUser(result.data);
    await saveUser(result.data);
  };
  useEffect(() => {
    loadTrips();
    handleUpdateProfile({});

    return () => {
      mounted = false;
    };
  }, []);

  const onRefresh = React.useCallback(() => {
    if (mounted) {
      setRefreshing(true);
    }
    (async () => {
      await loadTrips();
      handleUpdateProfile({});
      if (mounted) {
        setRefreshing(false);
      }
    })();
  }, []);
  // socket.on("trip:updated:users", (data) => {
  //   if (data.receivers) {
  //     if (data.receivers.includes(user._id)) {
  //       if (mounted) {
  //         loadTrips();
  //       }
  //     }
  //   }
  // });
  return (
    <View style={styles.container}>
      <StatusBar animated={true} hidden={true} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[styles.blueSection]}>
          <View style={styles.userDetails}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.openDrawer();
              }}
              style={styles.userDetailsTwo}
            >
              <AppUserAvatar
                profilePhoto={user.profilePhoto}
                size="small"
                onPress={() => {
                  props.navigation.openDrawer();
                }}
              />
              {!expandWhiteSection && (
                <AppText style={{ color: colors.white, marginLeft: 10 }}>
                  Hi, {user.firstName}{" "}
                  <ActivityIndicator
                    animating={loadingtrips}
                    color={colors.primary}
                  />
                </AppText>
              )}
            </TouchableOpacity>
            {expandWhiteSection && (
              <AppText
                size="medium"
                style={{ color: colors.white, fontWeight: "bold" }}
              >
                Log-X
              </AppText>
            )}
            <View style={{ position: "relative" }}>
              {unreadNotifications.length > 0 && (
                <View
                  style={{
                    backgroundColor: colors.customBlue,
                    width: 10,
                    height: 10,
                    position: "absolute",
                    borderRadius: 10 / 2,
                    left: 2,
                    zIndex: 2,
                  }}
                />
              )}
              <Feather
                name="bell"
                size={30}
                color={colors.white}
                onPress={() => {
                  props.navigation.navigate("NotificationsScreen");
                }}
              />
            </View>
          </View>
          <View
            style={[
              {
                paddingHorizontal: 32,
                minHeight: 150,
              },
              styles.mv10,
            ]}
          >
            <AppText
              size="16"
              style={{
                color: colors.primary,
                lineHeight: 21,
              }}
            >
              Welcome {user.firstName}.
            </AppText>
            <AppText
              size="16"
              style={{
                color: colors.primary,
                lineHeight: 21,
              }}
            >
              Experience the most seamless delivery process. Connect with
              freelance delivery personnels near you.
            </AppText>
            <TouchableOpacity
              onPress={() => {
                if (mode === "driver") {
                  changeUserMode("sender");
                } else {
                  changeUserMode("driver");
                }
                props.navigation.closeDrawer();
              }}
              style={styles.startDeliverying}
            >
              <AppText>Start delivering</AppText>
              <Ionicons name="arrow-forward" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.whiteSection]}>
          <TouchableOpacity
            style={styles.drawerBox}
            onPress={() => setExpandWhiteSection(!expandWhiteSection)}
          >
            <View style={styles.closeDrawer} />
          </TouchableOpacity>
          <View style={{ paddingHorizontal: width * 0.05 }}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("MyEarningsScreen");
              }}
              style={styles.yellowBox}
            >
              <AppText size="header">
                &#8358;{Math.round(user.availableBalance)}
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
                }}
              >
                <Feather name="plus" size={15} color={colors.primary} />
                <AppText style={styles.primary}>Add Fund</AppText>
              </TouchableOpacity>
            </TouchableOpacity>

            <SectionHeader
              headerText="Ongoing transactions"
              buttonText="More"
              onPress={() => props.navigation.navigate("Transactions")}
            />

            {ongoingTrips.length === 0 && (
              <View
                style={[
                  { justifyContent: "center", alignItems: "center" },
                  styles.mv10,
                ]}
              >
                <FontAwesome5 name="car-side" size={24} color="black" />
                <AppText style={styles.mv10}>
                  Your Ongoing Trips will Appear Here
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
            <SectionHeader headerText="Quick Actions" />
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
            }}
          >
            <TouchableOpacity
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
              }}
            >
              {showCancelPrompt ? (
                <View>
                  <AppText size="medium">Confirmation</AppText>
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
                    ]}
                  >
                    <AppButton
                      title="No, Go back"
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
                      title="Yes, Cancel"
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
                  <AppText size="medium">Delivery Request</AppText>
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
                    ]}
                  >
                    <AppButton
                      title="Cancel"
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
                      title="Join now"
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
          title="Send a Package"
          whiteText
          Icon={
            <Ionicons
              name="arrow-forward"
              color={colors.white}
              size={16}
              style={{ marginHorizontal: 16 }}
            />
          }
          // onPress={() => props.navigation.navigate("EnterLocationScreen")}
          // onPress={() => props.navigation.navigate("SelectJourneyType")}
          onPress={() => setOpenJourneyTypePanel(true)}
        />
      </View>

      <PayWithFlutterWave
        visible={openPayment}
        toggleModal={() => setOpenPayment(false)}
      />
      <SelectJorneyTypeAnyWhere
        visible={openJourneyTypePanel}
        toggleModal={() => setOpenJourneyTypePanel(false)}
        onContinue={() => props.navigation.navigate("EnterLocationScreen")}
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
  startDeliverying: {
    padding: 10,
    backgroundColor: "#E7E7F0",
    alignSelf: "flex-start",
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  userDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 32,
    marginTop: 5,
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

/** @format */

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import AppText from "../components/AppText";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import colors from "../config/colors";
import UserStatusComponent from "../components/UserStatusComponent";
import SectionHeader from "../components/SectionHeader";
import useLocation from "../hooks/useLocation";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import BidResponseItem from "../components/BidResponseItem";
import CountDown from "react-native-countdown-component";
import timeRemaining from "../utility/timeRemaining";
import placesApi from "../api/places";

import AuthContext from "../contexts/auth";
import useAuth from "../auth/useAuth";
import showToast from "../config/showToast";
import AddExtraTime from "../components/AddExtraTime";
import socket from "../api/socket";
import TripItem from "../components/TripItem";
import AddReview from "../components/AddReview";
import timeSince from "../utility/timeSince";
import MapComponent from "../components/MapComponent";
import { getDistanceFromLatLonInKm } from "../utility/latLong";
import NotificationContext from "../contexts/notifications";
import ResetButton from "../components/ResetButton";

function TransactionDetailsScreen(props) {
  let mounted = true;
  const { user } = useContext(AuthContext);
  const { notifications, setNotifications } = useContext(NotificationContext);

  const { saveAndSendTripCode, sendingTripCode, saveAndSendEndTripCode } =
    useAuth();
  const [endTripCode, setEndTripCode] = useState("");
  const [bids, setBids] = useState([]);
  const [code, setCode] = useState("");

  const [processingBid, setProcessingBid] = useState({
    id: "",
    loading: false,
    action: "",
  });

  const { item } = props.route.params;
  const relatedNotifications = notifications.filter(
    (notification) =>
      notification.data.request.content.data?.type === "chat:new" &&
      notification.data.request.content.data.trip === item._id
  );

  const [trip, setTrip] = useState(item);
  var t1 = new Date(trip?.eta);
  var t2 = new Date();
  var dif = t1.getTime() - t2.getTime();

  var Seconds_from_T1_to_T2 = dif / 1000;
  var Seconds_Between_Dates = Math.round(Seconds_from_T1_to_T2);
  let timeRemainingToETA =
    Seconds_Between_Dates > 0 ? Seconds_Between_Dates : 0;

  const acceptedBid = bids.find((bid) => bid.status === "accepted");

  const loadTriBids = async () => {
    const { data, error } = await placesApi.getTripBids(trip?._id);
    if (!error && data) {
      if (mounted) {
        setBids(data);
      }
    }
  };
  const joinTrip = async () => {
    const { data, error } = await placesApi.joinTrip(trip?._id);
    if (!error && data) {
      if (mounted) {
        setTrip(data);
      }
    }
  };
  const getDriverLocation = async () => {
    const { data, error } = await placesApi.getDriverLocation(trip?._id);
    if (!error && data) {
      if (data?.location?.latitude && data?.location?.longitude) {
        if (mounted) {
          setDriverLocation({
            latitude: data?.location?.latitude,
            longitude: data?.location?.longitude,
            latitudeDelta,
            longitudeDelta,
          });
        }
      }
    }
  };
  const loadTrip = async () => {
    const { data, error } = await placesApi.getSingleTrip(trip?._id);
    if (!error && data) {
      if (mounted) {
        setTrip(data);
      }
    }
  };

  const acceptRejectBid = async (id, status) => {
    if (mounted) {
      setProcessingBid({
        id,
        loading: true,
        action: status,
      });
    }

    const { data, error } = await placesApi.acceptRejectTrip(id, { status });
    if (mounted) {
      setProcessingBid({
        id: "",
        loading: false,
        action: "",
      });
    }
    if (!error && data) {
      socket.emit("trip:updated", { tripId: trip?._id });
      if (mounted) {
        setTrip(data);
      }

      loadTriBids();
    }
  };
  const changeTripStatus = async (id, status) => {
    const { data, error } = await placesApi.changeTripStatus(id, { status });

    if (!error && data) {
      socket.emit("trip:updated", { tripId: trip?._id });
      if (mounted) {
        setTrip(data);
        loadTriBids();
        setStartJorney(false);
      }
    }
  };
  const changeTripPackageStatus = async (tripId, packageId, status) => {
    const { data, error } = await placesApi.changeTripPackageStatus(
      tripId,
      packageId,
      { status }
    );

    if (!error && data) {
      socket.emit("trip:updated", { tripId: trip?._id });
      if (mounted) {
        setTrip(data);
        loadTriBids();
        setStartJorney(false);
      }
    }
  };
  const updateTripETA = async (id, formData) => {
    if (mounted) {
      setUpdatingTime(true);
    }
    const { data, error } = await placesApi.updateTrip(id, formData);
    if (mounted) {
      setUpdatingTime(false);
    }
    if (error) {
      showToast("Error Increasing Expected Time of Arrival. Try Again!");
    }
    if (!error && data) {
      socket.emit("trip:updated", { tripId: trip?._id });
      showToast("Expected Time of Arrival Increased!");
      if (mounted) {
        setTrip(data);
      }
    }
  };
  const requestForRefund = async (id, formData) => {
    if (mounted) {
      setRequestingRefund(true);
    }
    const { data, error } = await placesApi.updateTrip(id, formData);
    if (mounted) {
      setRequestingRefund(false);
    }
    if (error) {
      showToast("Error submitting refund request");
    }
    if (!error && data) {
      socket.emit("trip:updated", { tripId: trip?._id });
      showToast("Refund request submitted");
      if (mounted) {
        setTrip(data);
      }
    }
  };
  useEffect(() => {
    getDriverLocation();
    loadTriBids();
    loadTrip();
    socket.emit("request:to:join", trip?._id);

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    for (let index = 0; index < trip?.packages.length; index++) {
      const receiver = trip?.packages[index];
      if (receiver.receipentNumber === user?.phoneNumber) {
        if (!trip?.receipentsThatJoined.includes(receiver.receipentNumber)) {
          joinTrip();
        }
      }
    }
    return () => {
      mounted = false;
    };
  }, [trip?.receipentsThatJoined]);
  socket.on("trip:bid:created", () => {
    loadTriBids();
  });
  socket.on("trip:updated", () => {
    loadTrip();
  });

  const { getLocation, location } = useLocation();
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;

  const latitudeDelta = 0;
  const longitudeDelta = 0;

  const [region, setRegion] = useState({
    latitude: location?.coords?.latitude || 9.0173869,
    longitude: location?.coords?.longitude || 4.17981023,
    latitudeDelta,
    longitudeDelta,
  });

  const [driverLocation, setDriverLocation] = useState();

  useEffect(() => {
    (async () => {
      const data = await getLocation();
      if (mounted) {
        setRegion({
          latitude: data?.coords?.latitude,
          longitude: data?.coords?.longitude,
          latitudeDelta,
          longitudeDelta,
        });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const [startJorney, setStartJorney] = useState(false);
  const [acceptBid, setAcceptBid] = useState(false);
  const [addTime, setAddTime] = useState(false);
  const [addReview, setAddReview] = useState(false);
  const [updatingTime, setUpdatingTime] = useState(false);
  const [requestingRefund, setRequestingRefund] = useState(false);
  const [countingDown, setCountingDown] = useState(false);
  const [packageOne, setPackageOne] = useState(trip && trip?.packages[0]);
  const [showTrips, setShowTrips] = useState(true);
  const [selectedPackageItem, setSelectedPackageItem] = useState(null);
  const polylineCoordinates = [];
  trip?.packages.forEach((packageItem) => {
    polylineCoordinates.push({
      latitude: Number(packageItem.deliveryAddressLat),
      longitude: Number(packageItem.deliveryAddressLong),
    });
    polylineCoordinates.push({
      latitude: Number(packageItem.pickUpAddressLat),
      longitude: Number(packageItem.pickUpAddressLong),
    });
  });

  const tripStatuses = [
    "Waiting for confirmation",
    "Waiting for driver",
    "In transit",
    "Cancelled",
    "Completed",
  ];
  const [status, setStatus] = useState({
    text: "waiting for confirmation",
    color: colors.danger,
  });
  const DetailItem = ({ header, subHeader }) => {
    return (
      <View style={[styles.mb32]}>
        <AppText style={[styles.light]}>{header}</AppText>
        <AppText style={[styles.black]}>{subHeader}</AppText>
      </View>
    );
  };

  const whenDriverIsApproachingPickUp =
    trip?.driver &&
    trip?.status !== "completed" &&
    trip?.status !== "cancelled" &&
    trip?.status !== "inTransit";
  const whenDriverIsDelivering = trip?.status === "inTransit";
  // const height = Dimensions.get("screen").height;
  useEffect(() => {
    if (trip?.status === "inTransit") {
      setStatus({ text: tripStatuses[2], color: colors.primary });
    }
    if (trip?.status === "cancelled") {
      setStatus({ text: tripStatuses[3], color: colors.danger });
    }
    if (trip?.status === "completed") {
      setStatus({ text: tripStatuses[4], color: colors.success });
    }
    if (
      trip?.driver &&
      trip?.status !== "completed" &&
      trip?.status !== "cancelled" &&
      trip?.status !== "inTransit"
    ) {
      setStatus({ text: tripStatuses[1], color: "blue" });
    }
    return () => {
      mounted = false;
    };
  }, [trip?.status]);

  const [refreshing, setRefreshing] = React.useState(false);
  const [showFullScreenMap, setShowFullScreenMap] = useState(false);
  const [distanceToPickUp, setDistanceToPickUp] = useState("");

  const cancelTrip = () => {
    Alert.alert("Cancel Trip?", "Do you want to cancel this trip?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          changeTripStatus(trip?._id, "cancelled");
        },
      },
    ]);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    (async () => {
      loadTriBids();
      loadTrip();
      getDriverLocation();
      setRefreshing(false);
    })();
  }, []);

  const onDriverLocationChange = (data) => {
    let d = null;
    if (data.latitude && data.longitude && packageOne) {
      d = getDistanceFromLatLonInKm(
        Number(packageOne.pickUpAddressLat),
        Number(packageOne.pickUpAddressLong),
        data.latitude,
        data.longitude
      );
    }
    mounted && d && d / 1000 > 0
      ? setDistanceToPickUp(`${Math.round(d / 1000)} km`)
      : setDistanceToPickUp(`${Math.round(d)} m`);
  };

  if (!packageOne || packageOne === undefined) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <View>
          <MaterialIcons name="error-outline" size={100} color="black" />
        </View>
        <AppText style={{ marginVertical: 16 }}>
          Error Loading Trip Details
        </AppText>
        <AppButton
          title="Go Back"
          onPress={() => props.navigation.navigate("Home")}
        />
      </View>
    );
  }
  return (
    <View style={styles.fullPage}>
      <ScrollView
        style={{ height }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.blueContainer}>
          {trip?.status === "pending" && (
            <View>
              {new Date() > new Date(trip?.eta) && (
                <View
                  style={{
                    backgroundColor: colors.dangerLight,
                    padding: 5,
                    paddingHorizontal: 10,
                    borderRadius: 40,
                  }}
                >
                  <AppText
                    size="x-small"
                    style={[
                      styles.light,
                      { textAlign: "center", color: colors.danger },
                    ]}
                  >
                    Delivery was due {timeSince(new Date(trip?.eta), true)} ago
                  </AppText>
                  <AppText
                    size="x-small"
                    style={[
                      styles.light,
                      { textAlign: "center", color: colors.success },
                    ]}
                  >
                    Add time to continue
                  </AppText>
                </View>
              )}
              <View style={styles.startBox}>
                <AppText size="16" style={[styles.white, styles.bold]}>
                  {timeRemaining(trip?.eta)}
                </AppText>
                <Pressable style={styles.plusButton}>
                  <MaterialCommunityIcons name="plus" color={colors.light} />
                </Pressable>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => {
                    setCountingDown(true);
                  }}
                >
                  <AppText size="16" style={[styles.white, styles.bold]}>
                    Start
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {trip?.status === "inTransit" && (
            <View style={[{ alignItems: "center" }, styles.mv10]}>
              {new Date() > new Date(trip?.eta) && (
                <View
                  style={{
                    width: "80%",
                    backgroundColor: colors.dangerLight,
                    padding: 5,
                    paddingHorizontal: 10,
                    borderRadius: 40,
                  }}
                >
                  <AppText
                    size="x-small"
                    style={[
                      styles.light,
                      { textAlign: "center", color: colors.danger },
                    ]}
                  >
                    Delivery was due {timeSince(new Date(trip?.eta), true)} ago
                  </AppText>
                  <AppText
                    size="x-small"
                    style={[
                      styles.light,
                      { textAlign: "center", color: colors.success },
                    ]}
                  >
                    Add time to continue
                  </AppText>
                </View>
              )}
              <AppText size="x-small" style={[styles.light, styles.mv10]}>
                Delivery due in
              </AppText>

              <CountDown
                until={timeRemainingToETA}
                size={20}
                onFinish={() => alert("Time for trip has Elapsed")}
                digitStyle={{ backgroundColor: "transparent" }}
                timeLabelStyle={{
                  color: colors.light,
                  transform: [{ translateY: -10 }],
                }}
                digitTxtStyle={{ color: colors.light, fontSize: 25 }}
                // timeLabels={{ m: "m", s: "s", d: "d", h: "h" }}
                separatorStyle={{
                  color: colors.light,
                  transform: [{ translateY: -10 }, { translateX: 5 }],
                }}
                showSeparator
                running={true}
              />
              {user._id === trip?.sender?._id && (
                <Pressable
                  style={styles.addTimeButton}
                  onPress={() => setAddTime(true)}
                  disabled={updatingTime}
                >
                  <AppText size="16" style={[styles.light]}>
                    Add time
                  </AppText>
                </Pressable>
              )}
            </View>
          )}
          {trip?.status === "completed" && (
            <View style={[{ alignItems: "center" }, styles.mv10]}>
              <AppText size="large" style={[styles.light, styles.mv10]}>
                Delivery completed
              </AppText>
            </View>
          )}
          {trip?.status === "cancelled" && (
            <View style={[{ alignItems: "center" }, styles.mv10]}>
              <AppText size="large" style={[styles.light, styles.mv10]}>
                Delivery cancelled
              </AppText>
            </View>
          )}

          <AppText size="16" style={[styles.white, styles.bold]}>
            Order ID: #{trip?.tripCode}
          </AppText>
          <AppText size="x-small" style={[styles.light, styles.mv10]}>
            This transaction was initiated by {trip?.sender.firstName}{" "}
            {trip?.sender.lastName}
          </AppText>
        </View>
        <View style={[styles.whiteContainer]}>
          <UserStatusComponent
            heading={`${trip?.sender.firstName} ${trip?.sender.lastName}`}
            subHeading="Sender"
            status="Joined"
          />
          <UserStatusComponent
            heading={
              trip?.driver
                ? `${trip?.driver?.firstName} ${trip?.driver?.lastName}`
                : `Waiting for Driver`
            }
            subHeading="Delivery Personel"
            status={trip?.driver ? "Joined" : "Waiting"}
          />
          {trip?.packages.map((receiver, index) => (
            <UserStatusComponent
              key={index}
              heading={receiver.receipentName}
              subHeading={`Receiver ${index + 1}`}
              status={
                trip?.receipentsThatJoined.includes(receiver.receipentNumber)
                  ? "Joined"
                  : "Waiting"
              }
            />
          ))}
          {user._id === trip?.sender?._id &&
            trip?.status === "inTransit" &&
            trip?.refund && (
              <View
                style={[
                  {
                    backgroundColor: colors.successLight,
                    padding: 10,
                    borderColor: colors.success,
                    borderWidth: 1,
                    borderRadius: 15,
                  },
                  styles.mv10,
                ]}
              >
                <AppText
                  style={[
                    styles.bold,
                    styles.mv10,
                    { color: colors.success, textAlign: "center" },
                  ]}
                >
                  You will get a partial refund at the end of this Trip
                </AppText>
              </View>
            )}
          {user._id === trip?.sender?._id &&
            trip?.status === "inTransit" &&
            new Date() > new Date(trip?.eta) && (
              <View
                style={{
                  backgroundColor: colors.dangerLight,
                  padding: 10,
                  borderColor: colors.danger,
                  borderWidth: 1,
                  borderRadius: 15,
                }}
              >
                <AppText
                  style={[
                    styles.bold,
                    styles.mv10,
                    { color: colors.danger, textAlign: "center" },
                  ]}
                >
                  Delivery was due {timeSince(new Date(trip?.eta), true)} ago
                </AppText>
                <AppButton
                  onPress={() => setAddTime(true)}
                  disabled={updatingTime}
                  title="Extend Time"
                  fullWidth
                />
                <AppButton
                  onPress={() => requestForRefund(trip?._id, { refund: true })}
                  disabled={requestingRefund || trip?.refund}
                  title={
                    requestingRefund ? (
                      <ActivityIndicator
                        animating={requestingRefund}
                        color={colors.black}
                      />
                    ) : (
                      "Request Partial Refund"
                    )
                  }
                  fullWidth
                  secondary
                  style={[
                    { borderColor: colors.black, borderWidth: 1 },
                    styles.mv10,
                  ]}
                />
              </View>
            )}
          <View style={styles.mapView}>
            {/* <TouchableOpacity
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 3,
                backgroundColor: colors.primary,
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 16,
              }}
              onPress={() => setShowFullScreenMap(true)}>
              <AppText
                size='x-small'
                style={{ color: colors.white, fontWeight: "bold" }}>
                Full Screen
              </AppText>
            </TouchableOpacity> */}
            <MapComponent
              driverLocation={driverLocation}
              packages={trip?.packages}
              tripId={trip?._id}
              onDriverLocationChange={onDriverLocationChange}
            />

            {whenDriverIsApproachingPickUp && user._id !== trip?.driver?._id && (
              <View
                style={{
                  position: "absolute",
                  top: 10,
                  padding: 10,
                  backgroundColor: colors.white,
                  right: 10,
                  borderRadius: 10,
                }}
              >
                <AppText style={{ color: colors.black }}>
                  Driver is {distanceToPickUp} to pick up.
                </AppText>
              </View>
            )}
            {/* {whenDriverIsDelivering && (
              <View
                style={{
                  position: "absolute",
                  top: 10,
                  padding: 10,
                  backgroundColor: colors.white,
                  right: 10,
                  borderRadius: 10,
                }}>
                <AppText style={{ color: colors.black }}>
                  Driver is 10km away
                </AppText>
              </View>
            )} */}

            <View style={styles.mapStatus}>
              <AppText style={{ color: status.color }}>{status.text}</AppText>
            </View>
          </View>
          {trip?.status === "completed" && user._id !== trip?.driver?._id && (
            <AppButton
              title="Drop Review About the Trip"
              small
              fullWidth={false}
              style={{
                borderColor: colors.success,
                borderWidth: 1,
              }}
              secondary
              onPress={() => setAddReview(true)}
            />
          )}
          {/* for sender */}
          {user._id === trip?.sender?._id &&
            trip?.status !== "cancelled" &&
            trip?.status !== "completed" && (
              <View>
                <AppButton
                  title="Cancel Trip"
                  small
                  fullWidth={false}
                  style={{
                    alignSelf: "flex-start",
                    borderColor: colors.red,
                    borderWidth: 1,
                  }}
                  secondary
                  onPress={cancelTrip}
                />
              </View>
            )}
          {/* for driver */}
          {user._id === trip?.driver?._id && trip?.status === "pending" && (
            <View>
              <AppButton
                title="Cancel Trip"
                small
                fullWidth={false}
                style={{
                  alignSelf: "flex-start",
                  borderColor: colors.red,
                  borderWidth: 1,
                }}
                secondary
                onPress={cancelTrip}
              />
            </View>
          )}
          {user._id === trip?.sender?._id && trip?.status === "pending" && (
            <View>
              {bids && bids.length > 0 && (
                <AppText style={[styles.black, styles.mv10]}>
                  Bid Response
                </AppText>
              )}
              <View>
                {acceptedBid ? (
                  <FlatList
                    data={[acceptedBid]}
                    horizontal
                    renderItem={({ item }) => (
                      <BidResponseItem bidItem={item} />
                    )}
                    keyExtractor={(item) => item.id}
                  />
                ) : (
                  <FlatList
                    data={bids.slice(0, 5)}
                    horizontal
                    renderItem={({ item }) => (
                      <BidResponseItem
                        bidItem={item}
                        onAccept={() => {
                          setAcceptBid(true);
                          acceptRejectBid(item._id, "accepted");
                        }}
                        onReject={() => acceptRejectBid(item._id, "rejected")}
                        loadingAccept={
                          processingBid.id === item._id &&
                          processingBid.action === "accepted" &&
                          processingBid.loading
                        }
                        loadingReject={
                          processingBid.id === item._id &&
                          processingBid.action === "rejected" &&
                          processingBid.loading
                        }
                        disableButtons={processingBid.loading}
                        onPressProfile={() => {
                          props.navigation.navigate("DriverProfileScreen", {
                            userId: item?.driver?._id,
                          });
                        }}
                      />
                    )}
                    keyExtractor={(item) => item.id}
                  />
                )}
              </View>
            </View>
          )}

          {/* For Pending Trip  */}
          {user._id === trip?.driver?._id && trip?.status === "pending" && (
            <View>
              <View>
                {!startJorney ? (
                  <View>
                    <AppText style={[styles.black, styles.mv10]}>
                      Click the button below to start the journey.
                    </AppText>
                    <AppButton
                      title={
                        sendingTripCode ? (
                          <ActivityIndicator animating={sendingTripCode} />
                        ) : (
                          "Start the journey"
                        )
                      }
                      disabled={sendingTripCode}
                      style={styles.mv10}
                      // onPress={() => setStartJorney(true)}
                      onPress={async () => {
                        const newCode = await saveAndSendTripCode(
                          trip?._id,
                          trip?.sender?.email,
                          "start"
                        );
                        if (newCode) {
                          if (mounted) {
                            setCode(newCode);
                            setStartJorney(true);
                          }
                        }
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.mv10}>
                    <AppText style={[styles.black]}>
                      Get OTP to start the journey
                    </AppText>
                    <AppTextInput
                      placeholder="Enter Code"
                      keyboardType="number-pad"
                      returnKeyType="done"
                      style={styles.ph10}
                      controlText={
                        sendingTripCode ? (
                          <ActivityIndicator
                            animating={sendingTripCode}
                            color={colors.primary}
                          />
                        ) : (
                          <ResetButton
                            onPress={async () => {
                              const newCode = await saveAndSendTripCode(
                                trip?._id,
                                trip?.sender?.email,
                                "start"
                              );
                              if (newCode) {
                                if (mounted) {
                                  setCode(newCode);
                                  setStartJorney(true);
                                }
                              }
                            }}
                          />
                        )
                      }
                      onPressControlText={async () => {
                        const newCode = await saveAndSendTripCode(
                          trip?._id,
                          trip?.sender?.email,
                          "start"
                        );
                        if (newCode) {
                          if (mounted) {
                            setCode(newCode);
                            setStartJorney(true);
                          }
                        }
                      }}
                      maxLength={6}
                      onChangeText={(text) => {
                        if (text.length === 6) {
                          if (text.toString() === code.toString()) {
                            showToast("Code Approved! Trip will start now.");
                            changeTripStatus(trip?._id, "inTransit");
                          } else {
                            showToast("Invalid Code!");
                          }
                        }
                      }}
                    />
                    <AppText style={[styles.light, styles.mv10]}>
                      An otp code has been sent to the sender, kindly request
                      for the code and input it to start the journey.
                    </AppText>
                  </View>
                )}
              </View>
            </View>
          )}
          {/* For Pending Trip  */}

          {/* For Trip In Transit  */}
          {user._id === trip?.driver?._id && trip?.status === "inTransit" && (
            <View>
              <View>
                {!startJorney ? (
                  <View>
                    <AppButton
                      title={
                        sendingTripCode ? (
                          <ActivityIndicator animating={sendingTripCode} />
                        ) : (
                          "Mark the delivery completed"
                        )
                      }
                      disabled={sendingTripCode}
                      style={styles.mv10}
                      // onPress={() => setStartJorney(true)}
                      onPress={async () => {
                        // const newCode = await saveAndSendTripCode(
                        //   trip?._id,
                        //   trip?.sender?.email,
                        //   "end"
                        // );
                        // if (newCode) {
                        // setCode(newCode);
                        if (mounted) {
                          setStartJorney(true);
                        }
                        // }
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.mv10}>
                    {showTrips ? (
                      <View style={styles.mv10}>
                        {trip?.packages.map((packageItem, index) => (
                          <TripItem
                            index={index}
                            key={index}
                            packageItem={packageItem}
                            onPress={async () => {
                              setShowTrips(false);
                              setSelectedPackageItem(packageItem);
                              const newCode = await saveAndSendEndTripCode(
                                trip?._id,
                                packageItem._id
                              );
                              if (newCode) {
                                if (mounted) {
                                  setCode(newCode);
                                }
                                // setStartJorney(true);
                              }
                            }}
                            // completed
                          />
                        ))}
                      </View>
                    ) : (
                      <View>
                        <AppText style={[styles.black]}>
                          Get OTP to end the journey
                        </AppText>
                        <AppText style={[styles.light, styles.mv10]}>
                          We have sent the code to the receiver’s email and
                          number, request for a code from the receiver to end
                          the journey.
                        </AppText>
                        <AppTextInput
                          placeholder="Enter Code"
                          keyboardType="number-pad"
                          returnKeyType="done"
                          onChangeText={(text) => {
                            if (mounted) {
                              setEndTripCode(text);
                            }
                            if (text.length === 6) {
                              if (text.toString() === code.toString()) {
                                showToast(
                                  "Code Approved! This package will be marked as delivered."
                                );
                                changeTripPackageStatus(
                                  trip?._id,
                                  selectedPackageItem._id,
                                  "completed"
                                );
                              } else {
                                showToast("Invalid Code!");
                              }
                            }
                          }}
                          style={styles.ph10}
                          controlText={
                            sendingTripCode ? (
                              <ActivityIndicator
                                animating={sendingTripCode}
                                color={colors.primary}
                              />
                            ) : (
                              <ResetButton
                                onPress={async () => {
                                  const newCode = await saveAndSendEndTripCode(
                                    trip?._id,
                                    selectedPackageItem._id
                                  );
                                  if (newCode) {
                                    if (mounted) {
                                      setCode(newCode);
                                      setStartJorney(true);
                                    }
                                  }
                                }}
                              />
                            )
                          }
                          onPressControlText={async () => {
                            const newCode = await saveAndSendEndTripCode(
                              trip?._id,
                              selectedPackageItem._id
                            );
                            if (newCode) {
                              if (mounted) {
                                setCode(newCode);
                                setStartJorney(true);
                              }
                            }
                          }}
                        />
                        <AppButton
                          title="Proceed"
                          style={styles.mv10}
                          onPress={() => {
                            // changeTripPackageStatus(
                            //   trip?._id,
                            //   selectedPackageItem._id,
                            //   "completed"
                            // );

                            if (code.toString() === endTripCode.toString()) {
                              showToast(
                                "Code Approved! This package will be marked as delivered."
                              );
                              changeTripPackageStatus(
                                trip?._id,
                                selectedPackageItem._id,
                                "completed"
                              );
                            } else {
                              showToast("Invalid Code!");
                            }
                          }}
                        />
                        <AppButton
                          title="Go Back"
                          style={styles.mv10}
                          secondary
                          onPress={() => setShowTrips(true)}
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          )}
          {/* For Trip In Transit  */}

          <SectionHeader headerText="Details" />
          <DetailItem
            header="Sender's name"
            subHeader={`${trip?.sender.firstName} ${trip?.sender.lastName}`}
          />
          <DetailItem
            header="Sender's phone"
            subHeader={trip?.sender.phoneNumber}
          />
          {trip?.packages.map((packageItem, index) => (
            <View key={index}>
              <SectionHeader headerText={`Package ${index + 1}`} />
              <DetailItem
                header="Destination"
                subHeader={packageItem.deliveryAddress}
              />
              <DetailItem
                header="Recipient Number"
                subHeader={packageItem.receipentNumber}
              />
              <DetailItem
                header="Date"
                subHeader={new Date(packageItem.date).toLocaleString()}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      <Pressable
        style={[styles.floatButton, { bottom: 16 }]}
        onPress={() =>
          props.navigation.navigate("ChatScreen", { tripId: trip?._id })
        }
      >
        {relatedNotifications?.length > 0 && (
          <View style={styles.newChatIndicator}>
            <AppText style={[styles.white, styles.bold]}>
              {relatedNotifications?.length}
            </AppText>
          </View>
        )}
        <Ionicons name="chatbox" color={colors.white} size={16} />
        <AppText style={[styles.white, styles.mh10]}>Chat now</AppText>
      </Pressable>
      <AddExtraTime
        visible={addTime}
        toggleModal={() => setAddTime(false)}
        onSubmit={(seconds) => {
          // plus seconds
          let timeObject = new Date(trip?.eta);
          let milliseconds = seconds * 1000; //
          const newDate = new Date(timeObject.getTime() + milliseconds);

          //Increment eta
          updateTripETA(trip?._id, { eta: newDate });
        }}
      />
      <AddReview
        visible={addReview}
        trip={trip}
        toggleModal={() => setAddReview(false)}
        onSubmit={(seconds) => {
          // plus seconds
        }}
      />
      <Modal visible={showFullScreenMap}>
        <View style={{ width: "100%", height: "100%" }}>
          <Ionicons
            name="close-circle"
            color={colors.light}
            size={30}
            style={{ position: "absolute", top: 30, right: 20, zIndex: 3 }}
            onPress={() => setShowFullScreenMap(false)}
          />
          {/* <MapComponent
            driverLocation={driverLocation}
            packages={trip?.packages}
          /> */}
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  addTimeButton: {
    backgroundColor: "#343750",
    height: 24,
    width: 87,
    borderRadius: 20.5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#444869",
    borderWidth: 1,
  },
  alc: { alignItems: "center" },
  blueContainer: {
    backgroundColor: colors.secondary,
    paddingVertical: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  bold: { fontWeight: "bold" },
  container: { flex: 1 },
  fullPage: { width: "100%", height: "100%" },
  full_width: { flex: 1, height: "100%" },
  floatButton: {
    position: "absolute",
    right: 32,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  light: { color: colors.light },
  map: {
    width: "100%",
    height: "100%",
  },
  mapStatus: {
    backgroundColor: colors.white,
    zIndex: 2,
    position: "absolute",
    bottom: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  mapView: {
    height: Dimensions.get("screen").height * 0.6,
    width: "100%",
    borderRadius: 16,
    backgroundColor: colors.inputGray,
    marginVertical: 10,
    overflow: "hidden",
  },

  mb32: { marginBottom: 32 },
  mh10: { marginHorizontal: 10 },
  mv10: { marginVertical: 10 },
  newChatIndicator: {
    position: "absolute",
    top: -15,
    borderRadius: 20,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    paddingHorizontal: 10,
  },
  ph10: { paddingHorizontal: 10 },
  plusButton: {
    backgroundColor: "#4A4F72",
    height: 21,
    width: 21,
    borderRadius: 21 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    height: 24,
    width: 63,
    borderRadius: 20.5,
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    borderLeftColor: colors.secondary,
    borderLeftWidth: 1,
    width: 120,
    height: "100%",
    justifyContent: "center",
  },
  p32: { padding: 32 },
  row: { flexDirection: "row", alignItems: "center" },

  selected: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
  },
  selectedText: {
    color: colors.primary,
  },
  selectButton: {
    flex: 0.5,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  selectButtons: {
    height: 50,
    flexDirection: "row",
  },
  startBox: {
    backgroundColor: colors.secondaryLight,
    borderColor: "#444869",
    borderWidth: 1,
    width: 200,
    height: 54,
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  unselected: {
    borderBottomColor: colors.light,
    borderBottomWidth: 2,
  },
  unselectedText: {
    color: colors.light,
  },

  white: { color: colors.white },
  whiteContainer: { backgroundColor: colors.white, flex: 1, padding: 16 },
  w500: { fontWeight: "500" },
});
export default TransactionDetailsScreen;

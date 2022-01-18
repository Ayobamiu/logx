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
  ImageBackground,
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
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import useLocation from "../hooks/useLocation";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import BidResponseItem from "../components/BidResponseItem";
import CountDown from "react-native-countdown-component";
import timeRemaining from "../utility/timeRemaining";
import MapLabel from "../components/MapLabel";
import placesApi from "../api/places";

import AuthContext from "../contexts/auth";
import useAuth from "../auth/useAuth";
import showToast from "../config/showToast";
import AddExtraTime from "../components/AddExtraTime";
import socket from "../api/socket";
import TripItem from "../components/TripItem";
import AddReview from "../components/AddReview";
import timeSince from "../utility/timeSince";

function TransactionDetailsScreen(props) {
  const { user } = useContext(AuthContext);
  const {
    saveAndSendTripCode,
    sendingTripCode,
    saveAndSendEndTripCode,
  } = useAuth();

  const [loadingTripBids, setLoadingTripBids] = useState(false);
  const [endTripCode, setEndTripCode] = useState("");
  const [bids, setBids] = useState([]);
  const [code, setCode] = useState("");

  const [processingBid, setProcessingBid] = useState({
    id: "",
    loading: false,
    action: "",
  });

  const { item } = props.route.params;
  const [trip, setTrip] = useState(item);

  const acceptedBid = bids.find((bid) => bid.status === "accepted");

  const loadTriBids = async () => {
    setLoadingTripBids(true);

    const { data, error } = await placesApi.getTripBids(trip._id);
    if (!error && data) {
      setBids(data);
    }
    setLoadingTripBids(false);
  };
  const loadTrip = async () => {
    setLoadingTripBids(true);

    const { data, error } = await placesApi.getSingleTrip(trip._id);
    if (!error && data) {
      setTrip(data);
    }
    setLoadingTripBids(false);
  };

  const acceptRejectBid = async (id, status) => {
    setProcessingBid({
      id,
      loading: true,
      action: status,
    });

    const { data, error } = await placesApi.acceptRejectTrip(id, { status });
    setProcessingBid({
      id: "",
      loading: false,
      action: "",
    });
    if (!error && data) {
      setTrip(data);
      loadTriBids();
    }
  };
  const changeTripStatus = async (id, status) => {
    const { data, error } = await placesApi.changeTripStatus(id, { status });

    if (!error && data) {
      setTrip(data);
      loadTriBids();
      setStartJorney(false);
    }
  };
  const changeTripPackageStatus = async (tripId, packageId, status) => {
    const { data, error } = await placesApi.changeTripPackageStatus(
      tripId,
      packageId,
      { status }
    );

    if (!error && data) {
      setTrip(data);
      loadTriBids();
      setStartJorney(false);
    }
  };
  const updateTrip = async (id, formData) => {
    setUpdatingTime(true);
    const { data, error } = await placesApi.updateTrip(id, formData);
    setUpdatingTime(false);
    if (error) {
      showToast("Error Increasing Expected Time of Arrival. Try Again!");
    }
    if (!error && data) {
      showToast("Expected Time of Arrival Increased!");
      setTrip(data);
    }
  };
  useEffect(() => {
    loadTriBids();
    socket.emit("request:to:join", trip._id);
  }, []);

  socket.on("trip:bid:created", () => {
    loadTriBids();
  });
  socket.on("location:driver", (data) => {
    console.log("Driver's location changed.", {
      latitude: data.latitude,
      longitude: data.longitude,
    });
  });

  const { getLocation, location } = useLocation();
  const [region, setRegion] = useState({
    latitude: 8.9233587,
    longitude: -0.3674603,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  console.log("location", location);
  const [driverLocation, setDriverLocation] = useState({
    latitude: location?.coords?.latitude || 8.9233587,
    longitude: location?.coords?.latitude || -0.3674603,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  // let count = 0;
  const [count, setCount] = useState(false);
  //Update location every 20 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCount(!count);
      socket.emit("driver:location:request", { id: trip._id });
    }, 5000);
    return () => clearTimeout(timer);
  }, [count]);

  useEffect(() => {
    (async () => {
      const data = await getLocation();
      setRegion({
        latitude: data?.coords?.latitude,
        longitude: data?.coords?.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);
  const [startJorney, setStartJorney] = useState(false);
  const [acceptBid, setAcceptBid] = useState(false);
  const [addTime, setAddTime] = useState(false);
  const [addReview, setAddReview] = useState(false);
  const [updatingTime, setUpdatingTime] = useState(false);
  const [countingDown, setCountingDown] = useState(false);
  const [packageOne, setPackageOne] = useState(trip && trip.packages[0]);
  const [showTrips, setShowTrips] = useState(true);
  const [selectedPackageItem, setSelectedPackageItem] = useState(null);
  const polylineCoordinates = [];
  trip.packages.forEach((packageItem) => {
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

  const height = Dimensions.get("screen").height;
  useEffect(() => {
    if (trip.status === "inTransit") {
      setStatus({ text: tripStatuses[2], color: colors.primary });
    }
    if (trip.status === "cancelled") {
      setStatus({ text: tripStatuses[3], color: colors.danger });
    }
    if (trip.status === "completed") {
      setStatus({ text: tripStatuses[4], color: colors.success });
    }
    if (
      trip.driver &&
      trip.status !== "completed" &&
      trip.status !== "cancelled" &&
      trip.status !== "inTransit"
    ) {
      setStatus({ text: tripStatuses[1], color: "blue" });
    }
  }, [trip.status]);

  const [refreshing, setRefreshing] = React.useState(false);

  const cancelTrip = () => {
    Alert.alert("Cancel Trip?", "Do you want to cancel this trip?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          changeTripStatus(trip._id, "cancelled");
        },
      },
    ]);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    (async () => {
      loadTriBids();
      loadTrip();

      setRefreshing(false);
    })();
  }, []);

  if (!packageOne || packageOne === undefined) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <View>
          <MaterialIcons name='error-outline' size={100} color='black' />
        </View>
        <AppText style={{ marginVertical: 16 }}>
          Error Loading Trip Details
        </AppText>
        <AppButton
          title='Go Back'
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
        }>
        <View style={styles.blueContainer}>
          {trip.status === "pending" && (
            <View>
              {new Date() > new Date(trip.eta) && (
                <View
                  style={{
                    backgroundColor: colors.dangerLight,
                    padding: 5,
                    paddingHorizontal: 10,
                    borderRadius: 40,
                  }}>
                  <AppText
                    size='x-small'
                    style={[
                      styles.light,
                      { textAlign: "center", color: colors.danger },
                    ]}>
                    Delivery was due {timeSince(new Date(trip.eta), true)} ago
                  </AppText>
                  <AppText
                    size='x-small'
                    style={[
                      styles.light,
                      { textAlign: "center", color: colors.success },
                    ]}>
                    Add time to continue
                  </AppText>
                </View>
              )}
              <View style={styles.startBox}>
                <AppText size='16' style={[styles.white, styles.bold]}>
                  {timeRemaining(trip.eta)}
                </AppText>
                <Pressable style={styles.plusButton}>
                  <MaterialCommunityIcons name='plus' color={colors.light} />
                </Pressable>
                <Pressable
                  style={styles.startButton}
                  onPress={() => {
                    setCountingDown(true);
                  }}>
                  <AppText size='16' style={[styles.white, styles.bold]}>
                    Start
                  </AppText>
                </Pressable>
              </View>
            </View>
          )}
          {trip.status === "inTransit" && (
            <View style={[{ alignItems: "center" }, styles.mv10]}>
              {new Date() > new Date(trip.eta) && (
                <View
                  style={{
                    width: "80%",
                    backgroundColor: colors.dangerLight,
                    padding: 5,
                    paddingHorizontal: 10,
                    borderRadius: 40,
                  }}>
                  <AppText
                    size='x-small'
                    style={[
                      styles.light,
                      { textAlign: "center", color: colors.danger },
                    ]}>
                    Delivery was due {timeSince(new Date(trip.eta), true)} ago
                  </AppText>
                  <AppText
                    size='x-small'
                    style={[
                      styles.light,
                      { textAlign: "center", color: colors.success },
                    ]}>
                    Add time to continue
                  </AppText>
                </View>
              )}
              <AppText size='x-small' style={[styles.light, styles.mv10]}>
                Delivery due in
              </AppText>

              <CountDown
                until={new Date(trip.eta) - new Date()}
                size={20}
                onFinish={() => alert("Finished")}
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
                running
              />
              <Pressable
                style={styles.addTimeButton}
                onPress={() => setAddTime(true)}
                disabled={updatingTime}>
                <AppText size='16' style={[styles.light]}>
                  Add time
                </AppText>
              </Pressable>
            </View>
          )}
          {trip.status === "completed" && (
            <View style={[{ alignItems: "center" }, styles.mv10]}>
              <AppText size='large' style={[styles.light, styles.mv10]}>
                Delivery completed
              </AppText>
            </View>
          )}
          {trip.status === "cancelled" && (
            <View style={[{ alignItems: "center" }, styles.mv10]}>
              <AppText size='large' style={[styles.light, styles.mv10]}>
                Delivery cancelled
              </AppText>
            </View>
          )}

          <AppText size='16' style={[styles.white, styles.bold]}>
            Order ID: #{trip.tripCode}
          </AppText>
          <AppText size='x-small' style={[styles.light, styles.mv10]}>
            This transaction was initiated by {trip.sender.firstName}{" "}
            {trip.sender.lastName}
          </AppText>
        </View>
        <View style={[styles.whiteContainer]}>
          <UserStatusComponent
            heading={`${trip.sender.firstName} ${trip.sender.lastName}`}
            subHeading='Sender'
            status='Joined'
          />
          <UserStatusComponent
            heading={
              trip.driver
                ? `${trip.driver?.firstName} ${trip.driver?.lastName}`
                : `Waiting for Driver`
            }
            subHeading='Delivery Personel'
            status={trip.driver ? "Joined" : "Waiting"}
          />
          {trip.packages.map((receiver, index) => (
            <UserStatusComponent
              key={index}
              heading={receiver.receipentName}
              subHeading={`Receiver ${index + 1}`}
              status={trip.receipent ? "Joined" : "Waiting"}
            />
          ))}
          <View style={styles.mapView}>
            <MapView
              // region={{
              //   ...region,
              //   latitude: Number(driverLocation.latitude),
              //   longitude: Number(driverLocation.longitude),
              // }}

              style={styles.map}
              onRegionChange={() => setRegion(region)}
              loadingEnabled={true}
              showsUserLocation={true}>
              <Marker
                coordinate={{
                  latitude: Number(driverLocation.latitude),
                  longitude: Number(driverLocation.longitude),
                }}
                title="Driver's Location"
                description="Driver's Location"
                pinColor={colors.primary}>
                <MaterialCommunityIcons name='taxi' size={24} color='black' />
              </Marker>
              {packageOne && (
                <Polyline
                  lineDashPattern={[0]}
                  coordinates={polylineCoordinates}
                  strokeColor='#000' // fallback for when `strokeColors` is not supported by the map-provider
                  strokeColors={[colors.primary]}
                  strokeWidth={6}
                />
              )}

              {trip.packages.map((item, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: Number(item.deliveryAddressLat),
                    longitude: Number(item.deliveryAddressLong),
                  }}
                  title={`Delivery Location ${index + 1}`}
                  description={`Delivery Location ${index + 1}`}
                  pinColor={colors.primary}>
                  <MapLabel text={item.deliveryAddress} />
                </Marker>
              ))}
              {trip.packages.map((item, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: Number(item.pickUpAddressLat),
                    longitude: Number(item.pickUpAddressLong),
                  }}
                  title={`Pick Up Point ${index + 1}`}
                  description={`Pick Up Point ${index + 1}`}
                  pinColor={colors.primary}>
                  <MapLabel text={item.pickUpAddress} />
                </Marker>
              ))}
            </MapView>

            <View style={styles.mapStatus}>
              <AppText style={{ color: status.color }}>{status.text}</AppText>
            </View>
          </View>
          {trip.status === "completed" && (
            <AppButton
              title='Drop Review About the Trip'
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
          {trip.status !== "cancelled" && trip.status !== "completed" && (
            <View>
              <AppButton
                title='Cancel Trip'
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
          {user._id === trip.sender?._id && trip.status === "pending" && (
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
                        onAccept={() => setAcceptBid(true)}
                        onAccept={() => acceptRejectBid(item._id, "accepted")}
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
                      />
                    )}
                    keyExtractor={(item) => item.id}
                  />
                )}
              </View>
            </View>
          )}

          {/* For Pending Trip  */}
          {user._id === trip.driver?._id && trip.status === "pending" && (
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
                          trip._id,
                          trip?.sender?.email,
                          "start"
                        );
                        if (newCode) {
                          setCode(newCode);
                          setStartJorney(true);
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
                      placeholder='Enter Code'
                      keyboardType='number-pad'
                      returnKeyType='done'
                      style={styles.ph10}
                      controlText={
                        sendingTripCode ? (
                          <ActivityIndicator
                            animating={sendingTripCode}
                            color={colors.primary}
                          />
                        ) : (
                          "Resend Code"
                        )
                      }
                      onPressControlText={async () => {
                        const newCode = await saveAndSendTripCode(
                          trip._id,
                          user.email,
                          "start"
                        );
                        if (newCode) {
                          setCode(newCode);
                          setStartJorney(true);
                        }
                      }}
                      maxLength={6}
                      onChangeText={(text) => {
                        if (text.length === 6) {
                          if (text.toString() === code.toString()) {
                            showToast("Code Approved! Trip will start now.");
                            changeTripStatus(trip._id, "inTransit");
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
          {user._id === trip.driver?._id && trip.status === "inTransit" && (
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
                        //   trip._id,
                        //   trip?.sender?.email,
                        //   "end"
                        // );
                        // if (newCode) {
                        // setCode(newCode);
                        setStartJorney(true);
                        // }
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.mv10}>
                    {showTrips ? (
                      <View style={styles.mv10}>
                        {trip.packages.map((packageItem, index) => (
                          <TripItem
                            index={index}
                            key={index}
                            packageItem={packageItem}
                            onPress={async () => {
                              setShowTrips(false);
                              setSelectedPackageItem(packageItem);
                              const newCode = await saveAndSendEndTripCode(
                                trip._id,
                                packageItem._id
                              );
                              if (newCode) {
                                setCode(newCode);
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
                          placeholder='Enter Code'
                          keyboardType='number-pad'
                          returnKeyType='done'
                          onChangeText={(text) => {
                            setEndTripCode(text);
                            if (text.length === 6) {
                              if (text.toString() === code.toString()) {
                                showToast(
                                  "Code Approved! This package will be marked as delivered."
                                );
                                changeTripPackageStatus(
                                  trip._id,
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
                              "Resend Code"
                            )
                          }
                          onPressControlText={async () => {
                            const newCode = await saveAndSendEndTripCode(
                              trip._id,
                              selectedPackageItem._id
                            );
                            if (newCode) {
                              setCode(newCode);
                              setStartJorney(true);
                            }
                          }}
                        />
                        <AppButton
                          title='Proceed'
                          style={styles.mv10}
                          onPress={() => {
                            changeTripPackageStatus(
                              trip._id,
                              selectedPackageItem._id,
                              "completed"
                            );
                          }}
                        />
                        <AppButton
                          title='Go Back'
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

          <SectionHeader headerText='Details' />
          {trip.packages.map((packageItem, index) => (
            <View key={index}>
              <SectionHeader headerText={`Package ${index + 1}`} />
              <DetailItem
                header='Destination'
                subHeader={packageItem.deliveryAddress}
              />
              <DetailItem
                header='Date'
                subHeader={new Date(packageItem.date).toLocaleString()}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      <Pressable
        style={[styles.floatButton, { bottom: 16 }]}
        onPress={() =>
          props.navigation.navigate("ChatScreen", { tripId: trip._id })
        }>
        <Ionicons name='chatbox' color={colors.white} size={16} />
        <AppText style={[styles.white, styles.mh10]}>Chat now</AppText>
      </Pressable>
      <AddExtraTime
        visible={addTime}
        toggleModal={() => setAddTime(false)}
        onSubmit={(seconds) => {
          // plus seconds
          let timeObject = new Date(trip.eta);
          let milliseconds = seconds * 1000; //
          const newDate = new Date(timeObject.getTime() + milliseconds);

          //Increment eta
          updateTrip(trip._id, { eta: newDate });
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
    height: 200,
    width: "100%",
    borderRadius: 16,
    backgroundColor: colors.inputGray,
    marginVertical: 10,
    overflow: "hidden",
  },

  mb32: { marginBottom: 32 },
  mh10: { marginHorizontal: 10 },
  mv10: { marginVertical: 10 },
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

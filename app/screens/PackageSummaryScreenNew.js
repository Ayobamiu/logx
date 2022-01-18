/** @format */

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import AppButton from "../components/AppButton";
import AppModal from "../components/AppModal";
import AppText from "../components/AppText";
import colors from "../config/colors";
import Logx_onboardtwo from "../assets/PackageAdded.svg";
import PackageContext from "../contexts/package";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import placesApi from "../api/places";
import authApi from "../api/auth";
import AppAlert from "../components/AppAlert";
import PromptBottomSheet from "../components/PromptBottomSheet";
import AuthContext from "../contexts/auth";
import showToast from "../config/showToast";
import useAuth from "../auth/useAuth";
import TripContext from "../contexts/trip";
import socket from "../api/socket";
import AddCustomPrice from "../components/AddCustomPrice";
import { get } from "../utility/cache";
function PackageSummaryScreenNew(props) {
  const { saveUser } = useAuth();
  const [proceed, setProceed] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const { packages, setPackages } = useContext(PackageContext);
  const { trip, setTrip } = useContext(TripContext);
  const [showing, setShowing] = useState();
  const [showOffer, setShowOffer] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [addingTrip, setAddingTrip] = useState(false);
  const [estimatedCostOriginal, setEstimatedCostOriginal] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [showSelectPayment, setShowSelectPayment] = useState(false);
  const [showInsufficientFund, setShowInsufficientFund] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [distance, setDistance] = useState();
  const [journeyType, setJourneyType] = useState("");
  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data, error } = await placesApi.estimateTripCostAndDistance(
        packages
      );
      if (!error && data) {
        setEstimatedCostOriginal(data.price);
        setEstimatedCost(data.price);
        setDistance(data.distance);
      }
      setLoading(false);
    })();
    (async () => {
      const type = await get("journey:type");
      setJourneyType(type);
    })();
  }, [packages.length]);

  const DetailItem = ({ header, subHeader }) => {
    return (
      <View style={[styles.mb32]}>
        <AppText style={[styles.light]}>{header}</AppText>
        <AppText style={[styles.black]}>{subHeader}</AppText>
      </View>
    );
  };
  const TripItem = ({ children, show = false, index }) => {
    return (
      <View style={[styles.mb16]}>
        <View style={[{ flexDirection: "row", alignItems: "center" }]}>
          <TouchableOpacity
            onPress={() => {
              if (index === showing) {
                setShowing(null);
              } else {
                setShowing(index);
              }
            }}
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                padding: 8,
                backgroundColor: colors.inputGray,
                borderRadius: 26,
              },
            ]}>
            <View
              style={{
                padding: 8,
                backgroundColor: colors.primary,
                borderRadius: 26,
              }}>
              <AppText style={[styles.black]}>Destination {index + 1}</AppText>
            </View>
            <AppText style={[styles.black, styles.mh16]}>
              Chek out the details
            </AppText>
            <Feather
              name={show ? "chevron-up" : "chevron-down"}
              size={15}
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
          <Feather
            name='trash'
            size={20}
            color={colors.danger}
            style={styles.mh16}
            onPress={() => deletePackage(index)}
          />
        </View>

        {show ? children : null}
      </View>
    );
  };

  const handleUpdateProfile = async (data) => {
    setLoadingPayment(true);
    const result = await authApi.updateProfile(data);

    if (result.data.error) {
      setLoadingPayment(false);
      return showToast(result.data.message);
    }
    if (result.error) {
      setLoadingPayment(false);
      return showToast(result.message);
    }
    setLoadingPayment(false);
    setUser(result.data);
    await saveUser(result.data);
    showToast("Profile Updated!");
    // props.navigation.goBack();
    setShowInsufficientFund(false);
  };
  const handleAddTrip = async (data) => {
    setAddingTrip(true);
    const result = await placesApi.addTrip(data);

    if (result.data.error) {
      setAddingTrip(false);
      return showToast(result.data.message);
    }
    if (result.error) {
      setAddingTrip(false);
      return showToast(result.message);
    }

    setTrip(result.data);
    setAddingTrip(false);
    props.navigation.navigate("AvailableDrivers");
    setPackages([]);

    socket.emit("trip:create");
  };

  const deletePackage = (packageIndex) => {
    Alert.alert("Remove Package", "Do you want to remove this package?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          const currentPackages = [...packages];
          currentPackages.splice(packageIndex, 1);
          setPackages(currentPackages);
        },
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {/* ALert */}
        <AppModal isVisble={proceed} toggleModal={() => setProceed(!proceed)}>
          <View
            style={{
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              padding: 58,
            }}>
            <Logx_onboardtwo style={{ marginVertical: 40 }} />
            <AppText size='medium'>Successful</AppText>
            <AppText
              style={{
                color: colors.light,
                textAlign: "center",
                paddingVertical: 16,
              }}>
              You have successfully added a package for the two locations. Click
              the link below to proceed.
            </AppText>
            <AppButton
              title='Select a payment method'
              fullWidth
              style={styles.bottom}
              onPress={() => {
                setProceed(!proceed);
                props.navigation.navigate("AvailableDrivers");
              }}
            />
          </View>
        </AppModal>
        <AppAlert
          isVisble={showInsufficientFund}
          toggleModal={() => setShowInsufficientFund(false)}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name='exclamation-thick' />
          </View>
          <AppText style={[styles.bold, styles.mv10]}>
            Insufficient Balance
          </AppText>
          <AppText style={[{ textAlign: "center" }, styles.light]}>
            Hello, kindly fund your wallet an equivalent of the delivery before
            you can connect witha driver.
          </AppText>
          <ActivityIndicator
            animating={loadingPayment}
            color={colors.primary}
          />
          <AppButton
            title='Fund your wallet'
            onPress={() => {
              handleUpdateProfile({ availableBalance: estimatedCost * 2 });
            }}
          />
          <AppButton
            title='Later'
            secondary
            onPress={() => {
              setShowInsufficientFund(false);
            }}
          />
        </AppAlert>

        <AppAlert
          isVisble={addingTrip}
          toggleModal={() => setAddingTrip(false)}>
          <ActivityIndicator animating={addingTrip} color={colors.primary} />
          <AppText style={[{ textAlign: "center" }, styles.light, styles.mv10]}>
            Processing your trip details.
          </AppText>
        </AppAlert>

        {/* ALert */}

        <AppText size='header' style={[styles.mb16]}>
          Summary{" "}
        </AppText>
        {loading && (
          <AppText style={[styles.black, styles.mb32]}>
            Estimating Delivery .....{" "}
            <ActivityIndicator color={colors.primary} animating={loading} />
          </AppText>
        )}
        <AppText style={[styles.black, styles.mb32]}>
          {`Check the summary of the packages \nyou want to send.`}{" "}
        </AppText>
        {packages.map((i, index) => (
          <TripItem show={index === showing} index={index} key={index}>
            <View style={styles.mv10} />
            <DetailItem header='Pick Up Address' subHeader={i.pickUpAddress} />
            <DetailItem
              header='Receipent’s Contact'
              subHeader={i.receipentNumber}
            />
            <DetailItem
              header='Name on the Package'
              subHeader={i.receipentName}
            />
            <DetailItem
              header='Receipent’s Address'
              subHeader={i.deliveryAddress}
            />
            {/* <DetailItem
              header="Receipent’s Address"
              subHeader="62, Adeoyo area Ibadan, Oyo State"
            /> */}
            <DetailItem
              header='Delivery Description'
              subHeader={i.description}
            />
          </TripItem>
        ))}

        {journeyType === "inter-state" &&
          estimatedCost !== estimatedCostOriginal && (
            <View style={[styles.row, styles.mv16]}>
              <AppText style={[styles.black]}>Total to pay</AppText>
              {loading ? (
                <ActivityIndicator color={colors.primary} animating={loading} />
              ) : (
                <AppText style={[styles.black, styles.bold]}>
                  &#8358;{estimatedCost}
                </AppText>
              )}
            </View>
          )}
        {journeyType === "intra-state" && (
          <View style={[styles.row, styles.mv16]}>
            <AppText style={[styles.black]}>Total to pay</AppText>
            {loading ? (
              <ActivityIndicator color={colors.primary} animating={loading} />
            ) : (
              <AppText style={[styles.black, styles.bold]}>
                &#8358;{estimatedCost}
              </AppText>
            )}
          </View>
        )}

        {/*           typeof distance === "number" &&
          distance / 1000 > 150 &&  */}
        {journeyType === "inter-state" && (
          <AppButton
            title='Offer another Price'
            onPress={() => setShowOffer(true)}
            secondary
            style={{ borderWidth: 1 }}
          />
        )}

        <View style={[styles.row, styles.mv16]}>
          <AppText style={[styles.black]}>Payment Method </AppText>

          <AppText style={[styles.black, styles.bold]}>
            {paymentMethod === "wallet" ? "Pay from Wallet" : "Pay on delivery"}
          </AppText>
        </View>
        <AppText
          style={[{ color: colors.success }, styles.bold]}
          onPress={() => {
            setShowSelectPayment(true);
          }}>
          Change Payment Method{" "}
        </AppText>

        <AppButton
          title='Find available delivery personel'
          fullWidth
          style={[styles.mv10, { marginTop: 30 }]}
          onPress={() => {
            if (
              journeyType === "inter-state" &&
              estimatedCostOriginal === estimatedCost
            ) {
              return showToast("Offer prize for the trip.");
            }
            if (packages.length === 0) {
              return props.navigation.navigate("Home");
            }
            const etas = packages.map((i) => i.date);
            const tripData = {
              eta: etas.reduce(function (p, v) {
                return p > v ? p : v;
              }),
              price: estimatedCost,
              paymentMethod,
              packages,
            };

            if (paymentMethod === "wallet") {
              if (user.availableBalance < estimatedCost) {
                setShowInsufficientFund(true);
              } else {
                handleAddTrip(tripData);
              }
            } else {
              handleAddTrip(tripData);
            }
            // setShowSelectPayment(true);
          }}
          disabled={loading}
        />
        <AppButton
          title='Add another package'
          fullWidth
          secondary
          style={{ borderWidth: 1 }}
          onPress={() => {
            setPackages((currentValue) => [...currentValue, {}]);
            props.navigation.navigate("EnterLocationScreen");
          }}
        />
        {/* <View style={[styles.row, styles.mv16]}>
          <AppText>Available for other delivery Personel</AppText>
          <Switch value />
        </View> */}
        <PromptBottomSheet
          isVisble={showSelectPayment}
          toggleModal={() => setShowSelectPayment(false)}>
          <AppText style={[styles.black, styles.mb16]}>
            How do you want to pay?
          </AppText>
          <Pressable
            style={styles.paymentMethodButton}
            onPress={() => {
              setPaymentMethod("wallet");
              setShowSelectPayment(false);
            }}>
            <Feather name='credit-card' />
            <AppText style={{ marginHorizontal: 16 }}>Wallet </AppText>
            <MaterialCommunityIcons
              name='chevron-right'
              style={{ marginLeft: "auto" }}
            />
          </Pressable>
          <Pressable
            style={styles.paymentMethodButton}
            onPress={() => {
              setPaymentMethod("onDelivery");
              setShowSelectPayment(false);
            }}>
            <Feather name='map-pin' />
            <AppText style={{ marginHorizontal: 16 }}>Pay on delivery </AppText>
            <MaterialCommunityIcons
              name='chevron-right'
              style={{ marginLeft: "auto" }}
            />
          </Pressable>
        </PromptBottomSheet>
      </ScrollView>

      <AddCustomPrice
        journeyType={journeyType}
        onSubmit={(values) => {
          setEstimatedCost(values);
        }}
        toggleModal={() => setShowOffer(false)}
        visible={showOffer}
        estimatedPrice={estimatedCost}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  avatarSmall: {
    width: 20,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: 20 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  bold: { fontWeight: "bold" },
  black: { color: colors.black },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  fs18: { fontSize: 18 },
  light: { color: colors.light },
  mb16: { marginBottom: 16 },
  mb32: { marginBottom: 32 },
  mh16: { marginHorizontal: 16 },
  mv16: { marginVertical: 16 },
  mtAuto: { marginTop: "auto" },
  primary: { color: colors.primary },

  fs16: { fontSize: 16 },
  jANdACenter: { justifyContent: "center", alignItems: "center" },
  mv10: { marginVertical: 10 },
  paymentMethodButton: {
    flexDirection: "row",
    width: "100%",
    height: 71,
    backgroundColor: colors.inputGray,
    alignItems: "center",
    paddingHorizontal: 16,
    borderColor: "#CDC6BC",
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  secondary: { color: colors.secondary },
  textCenter: { textAlign: "center" },

  textContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 20,
  },
});
export default PackageSummaryScreenNew;

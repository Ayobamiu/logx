/** @format */

import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ImageBackground,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import AppText from "./AppText";
import { Feather, AntDesign, Fontisto } from "@expo/vector-icons";
import colors from "../config/colors";
import AppTextInput from "./AppTextInput";
import AppButton from "./AppButton";
import placesApi from "../api/places";
import showToast from "../config/showToast";
import secondsToHms from "../utility/secondsToHms";
import PreviewPackageDetails from "./PreviewPackageDetails";
import socket from "../api/socket";
import AuthContext from "../contexts/auth";

function DriverRequestPreview({ requestItem }) {
  const [showBidModal, setShowBidModal] = useState(false);
  const [isBidding, setIsBiding] = useState(false);
  const [bidingPrice, setBidingPrice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [acceptingTrip, setAcceptingTrip] = useState(false);
  const height = Dimensions.get("screen").height;
  const { user } = useContext(AuthContext);
  const driverAcceptTrip = async (tripId, driverId) => {
    setAcceptingTrip(true);
    const { data, error, errMessage } = await placesApi.driverAcceptTrip(
      tripId,
      { driverId }
    );
    setAcceptingTrip(false);
    if (error) {
      if (errMessage) {
        showToast(errMessage);
      } else {
        showToast("Error accepting trip.");
      }
    }
    if (!error && data) {
      showToast("Trip accepted successfully!");
      setShowModal(false);
    }
  };

  const handleSubmitBid = async () => {
    if (!bidingPrice) {
      return showToast("Enter asking price!");
    }
    const price = Number(bidingPrice);
    setIsBiding(true);

    const { data, error, errMessage } = await placesApi.addTripBid(
      { price },
      requestItem._id
    );

    if (error) {
      if (errMessage) {
        showToast(errMessage);
      } else {
        showToast("Error placing bid!");
      }
    }
    if (!error && data) {
      socket.emit("trip:bid:create", { tripId: requestItem._id });
      showToast("Your bid has been submitted successfully!");
      setShowBidModal(false);
    }
    setTimeout(() => {
      setIsBiding(false);
    }, 2000);
  };

  // if (requestItem.status !== "pending") return null;
  return (
    <Pressable
      style={[styles.driverItem, styles.mv8]}
      onPress={() => setShowModal(true)}>
      <View style={styles.driverGrey}>
        <View style={[styles.row]}>
          <ImageBackground
            source={{ uri: requestItem?.sender?.profilePhoto }}
            style={styles.avatar}
            borderRadius={32 / 2}>
            {!requestItem?.sender?.profilePhoto && (
              <AntDesign name='user' size={24} color={colors.black} />
            )}
          </ImageBackground>
          <View style={styles.ml10}>
            <AppText size='16' style={styles.bold}>
              {requestItem?.sender?.firstName} {requestItem?.sender?.lastName}
            </AppText>
            <AppText size='16' style={styles.light}>
              {Math.round(requestItem.distance / 1000)} km Away
            </AppText>
          </View>
          <AppText size='16' style={[styles.black, styles.bold, styles.mlAuto]}>
            &#8358; {requestItem.price}
          </AppText>
        </View>
      </View>
      <View style={styles.driverWhite}>
        <View style={[styles.row]}>
          <AppText size='16' style={{ flex: 1 }} numberOfLines={1}>
            {requestItem && requestItem?.packages[0]?.pickUpAddress}
          </AppText>
          <AntDesign
            name='arrowright'
            size={24}
            color={colors.black}
            style={styles.mh16}
          />
          <AppText
            size='16'
            style={[styles.bold, { flex: 1 }]}
            numberOfLines={1}>
            {requestItem && requestItem?.packages[0]?.deliveryAddress}
          </AppText>
          <AppText size='16' style={[styles.light, styles.bold, styles.mlAuto]}>
            More
          </AppText>
          <Fontisto
            name='angle-right'
            size={16}
            color={colors.light}
            style={[styles.ml10]}
          />
        </View>
      </View>

      <Modal visible={showBidModal} transparent>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""}>
          <View style={{ height: "100%", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <Pressable
              style={{ flex: 0.3, width: "100%", flexGrow: 1 }}
              onPress={() => {
                setShowBidModal(false);
              }}
            />
            <View
              style={{
                backgroundColor: colors.white,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                overflow: "hidden",
              }}>
              <Pressable
                style={[styles.close, styles.mv16, { alignSelf: "center" }]}
                onPress={() => {
                  setShowBidModal(false);
                }}
              />
              <View style={{ padding: 16 }}>
                <AppText size='medium' style={styles.mv16}>
                  What’s your asking price?{" "}
                  <ActivityIndicator
                    color={colors.primary}
                    animating={isBidding}
                  />
                </AppText>
                <AppTextInput
                  style={styles.mv16}
                  title='Price'
                  onChangeText={(text) => setBidingPrice(text)}
                  keyboardType='number-pad'
                  returnKeyType='done'
                />
              </View>
              <View
                style={[
                  styles.row,
                  {
                    justifyContent: "space-around",
                    paddingBottom: 16,
                    paddingHorizontal: 32,
                  },
                ]}>
                <AppButton
                  title='Go back'
                  style={{ borderColor: colors.black, borderWidth: 1 }}
                  secondary
                  onPress={() => {
                    setShowBidModal(false);
                    setShowModal(true);
                  }}
                  disabled={isBidding}
                />
                <AppButton
                  title='Submit'
                  onPress={() => {
                    // setShowBidModal(false);
                    handleSubmitBid();
                  }}
                  disabled={isBidding}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showModal} transparent>
        <View style={{ height: "100%", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <Pressable
            style={{ flex: 0.3, width: "100%", flexGrow: 1 }}
            onPress={() => {
              setShowModal(false);
            }}
          />
          <View
            style={{
              backgroundColor: colors.white,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              overflow: "hidden",
            }}>
            <View style={styles.profileSection}>
              <Pressable
                style={[styles.close, styles.mb16]}
                onPress={() => {
                  setShowModal(false);
                }}
              />
              <ImageBackground
                source={{ uri: requestItem?.sender.profilePhoto }}
                borderRadius={47 / 2}
                style={styles.bigAvatar}>
                {!requestItem?.sender.profilePhoto && (
                  <Feather name='user' size={30} color={colors.black} />
                )}
              </ImageBackground>
              <AppText
                size='header'
                style={[styles.black, styles.bold, styles.mv8]}>
                {requestItem?.sender.firstName} {requestItem?.sender.lastName}
              </AppText>
              <AppText size='x-small' style={[styles.light]}>
                {Math.round(requestItem?.distance / 1000)} km Away
              </AppText>
            </View>
            <View
              style={[
                styles.borderBottom,
                styles.row,
                { padding: 16, justifyContent: "space-around" },
              ]}>
              <View style={[styles.row]}>
                <View style={[styles.avatar, styles.mh8]}>
                  <Fontisto name='ticket' color='#FF9A2E' size={(32 * 2) / 3} />
                </View>
                <AppText size='medium'>
                  &#8358; {Math.round(requestItem?.price)}
                </AppText>
              </View>
              <View style={[styles.row]}>
                <View style={[styles.avatar, styles.mh8]}>
                  <Fontisto name='clock' color='#4CD964' size={(32 * 2) / 3} />
                </View>
                <AppText size='medium'>{secondsToHms(3600 * 2)}</AppText>
              </View>
              <View style={[styles.row]}>
                <View style={[styles.avatar, styles.mh8]}>
                  <Fontisto
                    name='navigate'
                    color={colors.black}
                    size={(32 * 2) / 3}
                  />
                </View>
                <AppText size='medium'>
                  {Math.round(requestItem?.distance / 1000)}km
                </AppText>
              </View>
            </View>
            <View style={{ padding: 16, height: height * 0.4 }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={requestItem?.packages}
                renderItem={({ item }) => <PreviewPackageDetails item={item} />}
                keyExtractor={(item) => item._id}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      height: 1,
                      width: "100%",
                      backgroundColor: colors.light,
                      marginVertical: 10,
                    }}
                  />
                )}
              />
            </View>
            <View
              style={[
                styles.row,
                {
                  justifyContent: "space-around",
                  paddingBottom: 16,
                  paddingHorizontal: 32,
                },
              ]}>
              <AppButton
                title='Bid'
                style={{ borderColor: colors.black, borderWidth: 1 }}
                secondary
                onPress={() => {
                  setShowModal(false);
                  setShowBidModal(true);
                }}
              />
              <AppButton
                title={
                  acceptingTrip ? (
                    <ActivityIndicator animating={acceptingTrip} />
                  ) : (
                    "Accept"
                  )
                }
                onPress={async () => {
                  await driverAcceptTrip(requestItem._id, user._id);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Pressable>
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
  container: {},
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
  switchCase: {},
  waiting: {
    color: colors.primary,
    backgroundColor: colors.lightPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
export default DriverRequestPreview;

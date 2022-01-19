/** @format */

import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import AppTextInput from "../components/AppTextInput";
import SectionHeader from "../components/SectionHeader";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import MapView, { Marker } from "react-native-maps";
import useLocation from "../hooks/useLocation";
import AppButton from "../components/AppButton";
import { Formik } from "formik";
import AppText from "../components/AppText";
import * as Yup from "yup";
import * as Location from "expo-location";
import PackageContext from "../contexts/package";
import placeApi from "../api/places";
import AuthContext from "../contexts/auth";
import MapViewDirections from "react-native-maps-directions";
import showToast from "../config/showToast";
import { get } from "../utility/cache";
import AppModal from "../components/AppModal";
import SelectJorneyTypeAnyWhere from "../components/SelectJorneyTypeAnyWhere";

// import {  } from "react-native-svg";

const validationSchema = Yup.object().shape({
  from: Yup.string().required().label("Pick Up Location"),
  to: Yup.string().required().label("Delivery Location"),
  pickUpAddress: Yup.string().required().label("Pick Up Address"),
  pickUpAddressPlaceId: Yup.string()
    .required()
    .label("Pick Up Address Place ID"),
  deliveryAddress: Yup.string().required().label("Delivery Address"),
  deliveryAddressPlaceId: Yup.string()
    .required()
    .label("Delivery Address Place ID"),
});

function EnterLocationScreen(props) {
  const { packages, setPackages } = useContext(PackageContext);
  const { user } = useContext(AuthContext);
  const [predictions, setPredictions] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const { getLocation } = useLocation();
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [deliveryPoint, setDeliveryPoint] = useState(null);
  console.log("deliveryPoint", deliveryPoint);
  const [pickUPoint, setPickUPoint] = useState(null);
  console.log("pickUPoint", pickUPoint);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pickUpAddress, setPickUpAddress] = useState("");
  const [deliveryRegion, setDeliveryRegion] = useState("");
  const [pickUpRegion, setPickUpRegion] = useState("");
  const [journeyType, setJourneyType] = useState("");
  const [openJourneyTypePanel, setOpenJourneyTypePanel] = useState(false);

  const [sameRegionError, setSameRegionError] = useState(false);
  const [differentRegionError, setDifferentRegionError] = useState(false);

  const closeAllSuggest = () => {
    setShowToSuggestions(false);
    setShowFromSuggestions(false);
  };
  const [region, setRegion] = useState({
    latitude: 8.9233587,
    longitude: -0.3674603,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

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
    (async () => {
      const type = await get("journey:type");
      setJourneyType(type);
    })();

    return () => {
      setRegion({
        latitude: 8.9233587,
        longitude: -0.3674603,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    };
  }, [journeyType]);

  const getPredictions = async (value) => {
    setLoadingPredictions(true);
    await placeApi
      .placePrediction(value)
      .then((response) => {
        setPredictions(
          response?.data?.predictions?.map((i) => {
            return { description: i.description, place_id: i.place_id };
          })
        );
      })
      .catch((error) => {});
    setLoadingPredictions(false);
  };

  const [loadingLatLong, setLoadingLatLong] = useState(false);
  const getLatLong = async (placeId, type) => {
    setLoadingLatLong(true);
    await placeApi
      .getLatAndLong(placeId)
      .then((response) => {
        if (type === "d") {
          setDeliveryPoint(response?.data);
        } else {
          setPickUPoint(response?.data);
          setRegion({
            latitude: response?.data?.latitude,
            longitude: response?.data?.longitude,
            latitudeDelta: 0.1922,
            longitudeDelta: 0.0421,
          });
        }
        setLoadingLatLong(false);
      })
      .catch((error) => {
        setLoadingLatLong(false);
      });
  };

  const AutoCompleteBox = ({
    show = false,
    closePanel = () => {},
    results = [],
    onPressResult,
  }) => {
    if (!show) return null;
    return (
      <View style={{ zIndex: 2 }}>
        <ScrollView style={styles.suggestionsBox}>
          <TouchableOpacity style={styles.closeSuggestion} onPress={closePanel}>
            <ActivityIndicator
              animating={loadingPredictions}
              color={colors.primary}
            />
            <AppText
              style={{
                fontWeight: "bold",
                color: colors.primary,
                marginLeft: "auto",
              }}
              onPress={closePanel}>
              close
            </AppText>
          </TouchableOpacity>
          {/* <ActivityIndicator
            animating={results.length === 0 && loadingPredictions}
            color={colors.primary}
          /> */}
          {results.map((i, index) => (
            <TouchableOpacity
              key={index}
              style={{
                paddingVertical: 8,
                borderBottomColor: colors.grey,
                borderBottomWidth: 1,
              }}
              onPress={() => {
                onPressResult(i);
                closePanel();
              }}>
              <AppText>{i}</AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const getPickUpAndDeliveryRegion = async () => {
    const pickUpAddressData = await Location.reverseGeocodeAsync({
      latitude: pickUPoint?.latitude,
      longitude: pickUPoint?.longitude,
    }).catch((error) => {});
    setPickUpRegion(pickUpAddressData && pickUpAddressData[0]?.region);
    const deliveryAddressData = await Location.reverseGeocodeAsync({
      latitude: deliveryPoint?.latitude,
      longitude: deliveryPoint?.longitude,
    }).catch((error) => {});
    setDeliveryRegion(deliveryAddressData && deliveryAddressData[0]?.region);
  };

  useEffect(() => {
    getPickUpAndDeliveryRegion();
  }, [pickUPoint, deliveryPoint]);
  return (
    <Formik
      initialValues={{}}
      onSubmit={async (values) => {
        if (journeyType === "intra-state") {
          if (pickUpRegion !== deliveryRegion) {
            setDifferentRegionError(true);
            //return showPopUp
            return;
          }
        }
        if (journeyType === "inter-state") {
          if (pickUpRegion === deliveryRegion) {
            setSameRegionError(true);
            return;
          }
        }
        if (packages.length > 0) {
          let currentPackages = packages;
          currentPackages[currentPackages.length - 1] = {
            ...values,
            pickUpAddressLat: pickUPoint.latitude,
            pickUpAddressLong: pickUPoint.longitude,
            deliveryAddressLat: deliveryPoint.latitude,
            deliveryAddressLong: deliveryPoint.longitude,
            senderName: user.firstName,
            senderNumber: user.phoneNumber,
          };
          setPackages(currentPackages);
        } else {
          setPackages((currentValue) => [
            ...currentValue,
            {
              ...values,
              pickUpAddressLat: pickUPoint.latitude,
              pickUpAddressLong: pickUPoint.longitude,
              deliveryAddressLat: deliveryPoint.latitude,
              deliveryAddressLong: deliveryPoint.longitude,
              senderName: user.firstName,
              senderNumber: user.phoneNumber,
            },
          ]);
        }

        props.navigation.navigate("AddPackageScreen");
      }}
      validationSchema={validationSchema}>
      {({ handleChange, handleBlur, handleSubmit, errors, values }) => (
        <View style={styles.container}>
          <View style={styles.inputBox}>
            <View style={{ flexDirection: "row" }}>
              <SectionHeader headerText='Enter destination details' />
              <ActivityIndicator
                color={colors.primary}
                animating={loadingLatLong}
              />
            </View>
            <AppTextInput
              editable={!loadingLatLong}
              white
              placeholder='Where are you picking from?'
              style={{ paddingHorizontal: 10 }}
              Icon={
                <FontAwesome5
                  name='angle-right'
                  size={20}
                  color={colors.grey}
                />
              }
              onChangeText={async (value) => {
                handleChange("pickUpAddress")(value);
                handleChange("pickUpAddressPlaceId")("23.3");
                handleChange("from")(value);

                getPredictions(value);
              }}
              onBlur={handleBlur("pickUpAddress")}
              autoCapitalize='none'
              onFocus={() => {
                setShowToSuggestions(false);
                setShowFromSuggestions(true);
              }}
              value={values.pickUpAddress}
            />
            <AutoCompleteBox
              show={showFromSuggestions}
              closePanel={closeAllSuggest}
              results={predictions?.map((i) => {
                return i.description;
              })}
              onPressResult={(value) => {
                handleChange("pickUpAddress")(value);
                setPickUpAddress(value);
                handleChange("from")(value);
                const targetAdd = predictions.find(
                  (i) => i.description === value
                );

                handleChange("pickUpAddressPlaceId")(targetAdd.place_id);
                getLatLong(targetAdd.place_id, "p");
              }}
            />
            <AppText style={[{ color: colors.danger }, styles.mb32]}>
              {errors.pickUpAddress}
            </AppText>
            <AppTextInput
              white
              editable={!loadingLatLong}
              placeholder='Where are you delivering to?'
              style={{ paddingHorizontal: 10 }}
              Icon={
                <FontAwesome5
                  name='angle-right'
                  size={20}
                  color={colors.grey}
                />
              }
              onChangeText={(value) => {
                handleChange("deliveryAddress")(value);
                handleChange("deliveryAddressPlaceId")("43.2");
                handleChange("to")(value);
                getPredictions(value);
              }}
              onFocus={() => {
                setShowToSuggestions(true);
                setShowFromSuggestions(false);
              }}
              value={values.deliveryAddress}
              autoCapitalize='none'
            />
            <AutoCompleteBox
              show={showToSuggestions}
              closePanel={closeAllSuggest}
              results={predictions?.map((i) => {
                return i.description;
              })}
              onPressResult={(value) => {
                handleChange("deliveryAddress")(value);
                setDeliveryAddress(value);
                handleChange("to")(value);
                const targetAdd = predictions.find(
                  (i) => i.description === value
                );
                handleChange("deliveryAddressPlaceId")(targetAdd.place_id);
                getLatLong(targetAdd.place_id, "d");
              }}
            />
            <AppText style={[{ color: colors.danger }, styles.mb32]}>
              {errors.deliveryAddress}
            </AppText>
          </View>
          <View style={styles.mapBox}>
            <MapView
              region={region}
              style={styles.map}
              // showsTraffic={true}
              // showsCompass={true}
              onRegionChange={() => setRegion(region)}
              loadingEnabled={true}
              showsUserLocation={true}>
              {pickUPoint && deliveryPoint && (
                <MapViewDirections
                  origin={{ ...pickUPoint }}
                  destination={{ ...deliveryPoint }}
                  apikey='AIzaSyCM5oYQQFY3p_RJ7T0_AfVQDt4hcTLhs-Y'
                  mode='DRIVING'
                  timePrecision='now'
                  strokeWidth={3}
                  strokeColor='hotpink'
                  tappable
                  geodesic
                  onError={() => {
                    showToast(
                      "This route is plied by Airlines. We don't deliver by Air."
                    );
                  }}
                />
              )}
              {deliveryPoint && (
                <Marker
                  coordinate={deliveryPoint}
                  title='Delivery Point'
                  description={deliveryAddress}
                  pinColor={colors.primary}>
                  <Ionicons name='location' size={25} color={colors.primary} />
                </Marker>
              )}
              {pickUPoint && (
                <Marker
                  coordinate={pickUPoint}
                  title='Pick Up Point'
                  description={pickUpAddress}
                  pinColor={colors.primary}>
                  <Ionicons name='location' size={25} color={colors.primary} />
                </Marker>
              )}
            </MapView>
          </View>

          <View style={styles.button}>
            <AppButton
              title={
                loadingLatLong ? (
                  <ActivityIndicator animating={loadingLatLong} />
                ) : (
                  "Done"
                )
              }
              fullWidth
              // onPress={() => props.navigation.navigate("AddPackageScreen")}
              onPress={handleSubmit}
              disabled={loadingLatLong}
            />
          </View>

          <AppModal isVisble={differentRegionError}>
            <View style={styles.modalBox}>
              <View style={styles.modalContainer}>
                <Ionicons
                  name='close-circle'
                  color={colors.primary}
                  size={67}
                />
                <AppText style={{ fontWeight: "bold", marginVertical: 10 }}>
                  Not Valid.
                </AppText>
                <AppText style={{ textAlign: "center" }}>
                  Sorry, you can not use this option. We noticed you are sending
                  between different cities. Go back and choose{" "}
                  <AppText style={{ fontWeight: "bold" }}>intercity</AppText> or
                  change your address.
                </AppText>
                <AppButton
                  title='Choose Inter-City'
                  style={{ marginVertical: 10 }}
                  onPress={() => {
                    setOpenJourneyTypePanel(true);
                    setDifferentRegionError(false);
                    // props.navigation.goBack();
                  }}
                />
                <AppButton
                  title='Change My Address'
                  style={{ marginVertical: 10 }}
                  onPress={() => {
                    setDifferentRegionError(false);
                  }}
                />
              </View>
            </View>
          </AppModal>
          <AppModal isVisble={sameRegionError}>
            <View style={styles.modalBox}>
              <View style={styles.modalContainer}>
                <Ionicons
                  name='close-circle'
                  color={colors.primary}
                  size={67}
                />
                <AppText style={{ fontWeight: "bold", marginVertical: 10 }}>
                  Not Valid.
                </AppText>
                <AppText style={{ textAlign: "center" }}>
                  Sorry, you can not use this option. We noticed you are sending
                  within the same city. Go back and choose{" "}
                  <AppText style={{ fontWeight: "bold" }}>intracity</AppText> or
                  change your address.
                </AppText>
                <AppButton
                  title='Choose Intra-city'
                  style={{ marginVertical: 10 }}
                  onPress={() => {
                    setSameRegionError(false);
                    setOpenJourneyTypePanel(true);
                  }}
                />
                <AppButton
                  title='Change My Address'
                  style={{ marginVertical: 10 }}
                  onPress={() => {
                    setSameRegionError(false);
                  }}
                />
              </View>
            </View>
          </AppModal>
          <SelectJorneyTypeAnyWhere
            visible={openJourneyTypePanel}
            toggleModal={() => setOpenJourneyTypePanel(false)}
            onContinue={(r) => setJourneyType(r)}
          />
        </View>
      )}
    </Formik>
  );
}
const styles = StyleSheet.create({
  autocompleteContainer: {
    position: "absolute",
    bottom: 0,
    zIndex: 2,
    height: 400,
    width: "100%",
    backgroundColor: colors.red,
  },
  button: {
    position: "absolute",
    bottom: 0,
    padding: 16,
    width: "100%",
  },
  closeSuggestion: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  inputBox: {
    padding: 16,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapBox: {
    flex: 0.7,
    flexGrow: 1,
  },
  modalBox: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.opaque,
  },
  modalContainer: {
    minHeight: 100,
    minWidth: 100,
    backgroundColor: colors.white,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "70%",
    padding: 20,
  },
  suggestionsBox: {
    maxHeight: 200,
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
export default EnterLocationScreen;

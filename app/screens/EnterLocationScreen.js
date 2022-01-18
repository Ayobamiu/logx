/** @format */

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AppTextInput from "../components/AppTextInput";
import SectionHeader from "../components/SectionHeader";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import MapView, { Marker, Polygon, Polyline } from "react-native-maps";
import useLocation from "../hooks/useLocation";
import AppButton from "../components/AppButton";
import { Formik } from "formik";
import AppText from "../components/AppText";
import * as Yup from "yup";
import PackageContext from "../contexts/package";
import placeApi from "../api/places";
import AuthContext from "../contexts/auth";
import MapLabel from "../components/MapLabel";
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
  const { user, setUser } = useContext(AuthContext);
  const [predictions, setPredictions] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const { getLocation } = useLocation();
  const [location, setLocation] = useState(null);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [deliveryPoint, setDeliveryPoint] = useState(null);
  const [pickUPoint, setPickUPoint] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pickUpAddress, setPickUpAddress] = useState("");
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
  }, []);

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
  const getLatLong = async (placeId, type) => {
    // setLoadingPredictions(true);
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
      })
      .catch((error) => {});
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

  return (
    <Formik
      initialValues={{}}
      onSubmit={async (values) => {
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
            <SectionHeader headerText='Enter destination details' />

            <AppTextInput
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
                <Polyline
                  lineDashPattern={[0]}
                  coordinates={[{ ...deliveryPoint }, { ...pickUPoint }]}
                  strokeColor='#000' // fallback for when `strokeColors` is not supported by the map-provider
                  strokeColors={[colors.success]}
                  strokeWidth={6}
                />
              )}
              {deliveryPoint && (
                <Marker
                  coordinate={deliveryPoint}
                  title='Delivery Point'
                  description='Delivery Point'
                  pinColor={colors.primary}>
                  <MapLabel text={deliveryAddress || "Delivery Point"} />
                </Marker>
              )}
              {pickUPoint && (
                <Marker
                  coordinate={pickUPoint}
                  title='Pick Up Point'
                  description='Pick Up Point'
                  pinColor={colors.primary}>
                  <MapLabel text={pickUpAddress || "Pick Up Point"} />
                </Marker>
              )}
            </MapView>
          </View>

          <View style={styles.button}>
            <AppButton
              title='Done'
              fullWidth
              // onPress={() => props.navigation.navigate("AddPackageScreen")}
              onPress={handleSubmit}
              // disabled={loading}
            />
          </View>
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

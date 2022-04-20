/** @format */

import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  Dimensions,
} from "react-native";
import AppTextInput from "../components/AppTextInput";
import SectionHeader from "../components/SectionHeader";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
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
import axios from "axios";

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
  let mounted = true;

  const formikForm = useRef();
  const { packages, setPackages } = useContext(PackageContext);
  const { user } = useContext(AuthContext);
  const [predictions, setPredictions] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const { getLocation, getAddressFromLatLong, getLastLocation } = useLocation();
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [deliveryPoint, setDeliveryPoint] = useState(null);
  const [pickUPoint, setPickUPoint] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pickUpAddress, setPickUpAddress] = useState("");
  const [deliveryRegion, setDeliveryRegion] = useState("");
  const [pickUpRegion, setPickUpRegion] = useState("");
  const [journeyType, setJourneyType] = useState("");
  const [openJourneyTypePanel, setOpenJourneyTypePanel] = useState(false);
  const [gettingMyCurrentLocation, setGettingMyCurrentLocation] =
    useState(false);

  const [sameRegionError, setSameRegionError] = useState(false);
  const [differentRegionError, setDifferentRegionError] = useState(false);

  const closeAllSuggest = () => {
    if (mounted) {
      setShowToSuggestions(false);
      setShowFromSuggestions(false);
    }
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
      if (mounted) {
        setRegion({
          latitude: data?.coords?.latitude,
          longitude: data?.coords?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
    (async () => {
      const type = await get("journey:type");
      if (mounted) {
        setJourneyType(type);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [journeyType]);

  const getPredictions = async (value) => {
    var config = {
      method: "get",

      url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
        value
      )}&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry%2Cplace_id&key=AIzaSyAPHNQTmBHXh6-lJaWmIMFbRikrrkncssk`,
      headers: {},
    };
    if (mounted) {
      setLoadingPredictions(true);
    }
    await axios(config)
      .then((response) => {
        if (mounted) {
          setPredictions(
            response?.data?.candidates?.map((i) => {
              return {
                formatted_address: i.formatted_address,
                name: i.name,
                place_id: i.place_id,
                latitude: i.geometry.location.lat,
                longitude: i.geometry.location.lng,
              };
            })
          );
        }
      })
      .catch((error) => {});
    if (mounted) {
      setLoadingPredictions(false);
    }
  };

  const [loadingLatLong, setLoadingLatLong] = useState(false);

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
              onPress={closePanel}
            >
              close
            </AppText>
          </TouchableOpacity>

          {results.map((i, index) => (
            <TouchableOpacity
              key={index}
              style={{
                paddingVertical: 8,
                borderBottomColor: colors.grey,
                borderBottomWidth: 1,
              }}
              onPress={() => {
                onPressResult(i.formatted_address);
                closePanel();
              }}
            >
              <AppText size="x-small">{i.name}</AppText>
              <AppText style={{ color: colors.secondary }} size="xx-small">
                {i.formatted_address}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const getPickUpAndDeliveryRegion = async () => {
    if (mounted) {
      setLoadingLatLong(true);
    }
    // const pickUpAddressData = await Location.reverseGeocodeAsync({
    //   latitude: pickUPoint?.latitude,
    //   longitude: pickUPoint?.longitude,
    // }).catch((error) => {
    // });

    if (pickUPoint?.latitude && pickUPoint?.longitude) {
      const pickUpAddressData = await axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pickUPoint?.latitude},${pickUPoint?.longitude}&key=AIzaSyAPHNQTmBHXh6-lJaWmIMFbRikrrkncssk&type=street`
        )
        .catch((e) => {});
      const pickUpAddressResult = pickUpAddressData?.data.results[0];
      let pickUpAddressComponent = pickUpAddressResult?.address_components.map(
        (i) => {
          if (!i.types.includes("country")) {
            return i.long_name;
          } else {
            return "";
          }
        }
      );
      // if (!pickUpAddressComponent) {
      //   pickUpAddressComponent = pickUpAddressResult?.address_components.find(
      //     (i) => i.types.includes("country")
      //   );
      // }

      if (mounted) {
        setPickUpRegion(pickUpAddressComponent.filter((v) => v != ""));
      }
    }

    if (deliveryPoint?.latitude && deliveryPoint?.longitude) {
      const deliveryAddressData = await axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${deliveryPoint?.latitude},${deliveryPoint?.longitude}&key=AIzaSyAPHNQTmBHXh6-lJaWmIMFbRikrrkncssk`
        )
        .catch((e) => {});
      const deliveryAddressResult = deliveryAddressData?.data.results[0];

      let deliveryAddressComponent =
        deliveryAddressResult?.address_components.map((i) => {
          if (!i.types.includes("country")) {
            return i.long_name;
          } else {
            return "";
          }
        });
      if (mounted) {
        setDeliveryRegion(deliveryAddressComponent.filter((v) => v != ""));
      }
    }
    setLoadingLatLong(false);
  };

  const handleSubmitPackages = async (values) => {
    if (!pickUpRegion || pickUpRegion === undefined) {
      showToast("Select a pick up address from suggestions");
      return;
    }
    if (!deliveryRegion || deliveryRegion === undefined) {
      showToast("Select a delivery address from suggestions");
      return;
    }
    const intersection = deliveryRegion.filter((element) =>
      pickUpRegion.includes(element)
    );
    let sameArea = intersection.length > 0;

    if (journeyType === "intra-state") {
      if (!sameArea) {
        if (mounted) {
          setDifferentRegionError(true);
        }
        return;
      }
    }
    if (journeyType === "inter-state") {
      if (sameArea) {
        if (mounted) {
          setSameRegionError(true);
        }
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
      if (mounted) {
        setPackages(currentPackages);
      }
    } else {
      if (mounted) {
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
    }

    props.navigation.navigate("AddPackageScreen");
  };

  const useMyCurrentPositionAsPickUpLocation = async () => {
    if (mounted) {
      setGettingMyCurrentLocation(true);
    }
    const data = await getLastLocation();

    if (!data) {
      if (mounted) {
        setGettingMyCurrentLocation(false);
      }
      return showToast(
        "Error getting your current location! Type your Location."
      );
    }

    if (data?.coords?.latitude && data?.coords?.longitude) {
      let currentAddresData = await axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${data?.coords?.latitude},${data?.coords?.longitude}&key=AIzaSyAPHNQTmBHXh6-lJaWmIMFbRikrrkncssk&result_type=street_address`
        )
        .catch((e) => {});
      if (!currentAddresResult) {
        showToast(
          "Could not retrieve your street address📍, providing alternate address.🗾"
        );
        currentAddresData = await axios
          .get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${data?.coords?.latitude},${data?.coords?.longitude}&key=AIzaSyAPHNQTmBHXh6-lJaWmIMFbRikrrkncssk`
          )
          .catch((e) => {});
      }
      const currentAddresResult = currentAddresData?.data.results[0];
      if (mounted && currentAddresResult) {
        setPickUpAddress(currentAddresResult.formatted_address);
        formikForm?.current?.handleChange("from")(
          currentAddresResult.formatted_address
        );
        formikForm?.current?.handleChange("pickUpAddress")(
          currentAddresResult.formatted_address
        );
        formikForm?.current?.handleChange("pickUpAddressPlaceId")(
          currentAddresResult.place_id
        );
        setPickUPoint({
          latitude: data?.coords?.latitude,
          longitude: data?.coords?.longitude,
        });
        setRegion({
          latitude: data?.coords?.latitude,
          longitude: data?.coords?.longitude,
          latitudeDelta: 0.1922,
          longitudeDelta: 0.0421,
        });
      }
    }

    if (mounted) {
      setGettingMyCurrentLocation(false);
    }
  };

  useEffect(() => {
    if (pickUPoint || deliveryPoint) {
      getPickUpAndDeliveryRegion();
    }
  }, [pickUPoint, deliveryPoint]);
  return (
    <Formik
      innerRef={formikForm}
      initialValues={{}}
      onSubmit={handleSubmitPackages}
      validationSchema={validationSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, errors, values }) => (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : ""}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={{
              minHeight: "100%",
            }}
          >
            <View style={styles.inputBox}>
              <View style={{ flexDirection: "row" }}>
                <SectionHeader headerText="Enter destination details" />
                <ActivityIndicator
                  size="large"
                  color={colors.primary}
                  animating={loadingLatLong}
                />
              </View>
              <AppTextInput
                editable={!loadingLatLong}
                white
                placeholder="Where are you picking from?"
                style={{ paddingHorizontal: 10 }}
                Icon={
                  <TouchableOpacity
                    disabled={gettingMyCurrentLocation}
                    style={{ flexDirection: "row" }}
                    onPress={useMyCurrentPositionAsPickUpLocation}
                  >
                    <ActivityIndicator
                      animating={gettingMyCurrentLocation}
                      color={colors.primary}
                    />
                    <MaterialIcons
                      name="my-location"
                      size={20}
                      color={colors.black}
                      onPress={useMyCurrentPositionAsPickUpLocation}
                    />
                  </TouchableOpacity>
                }
                onChangeText={async (value) => {
                  handleChange("pickUpAddress")(value);
                  handleChange("pickUpAddressPlaceId")("23.3");
                  handleChange("from")(value);

                  getPredictions(value);
                }}
                onBlur={handleBlur("pickUpAddress")}
                autoCapitalize="none"
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
                  return {
                    name: i.name,
                    formatted_address: i.formatted_address,
                  };
                })}
                onPressResult={(value) => {
                  setPickUpAddress(value);
                  handleChange("from")(value);
                  const targetAdd = predictions.find(
                    (i) => i.formatted_address === value
                  );
                  handleChange("pickUpAddress")(`${targetAdd.name} ${value}`);

                  handleChange("pickUpAddressPlaceId")(targetAdd.place_id);
                  // getLatLong(targetAdd.place_id, "p");
                  setPickUPoint({
                    latitude: targetAdd.latitude,
                    longitude: targetAdd.longitude,
                  });
                  setRegion({
                    latitude: targetAdd.latitude,
                    longitude: targetAdd.longitude,
                    latitudeDelta: 0.1922,
                    longitudeDelta: 0.0421,
                  });
                }}
              />
              <AppText style={[{ color: colors.danger }, styles.mb32]}>
                {errors.pickUpAddress}
              </AppText>
              <AppTextInput
                white
                editable={!loadingLatLong}
                placeholder="Where are you delivering to?"
                style={{ paddingHorizontal: 10 }}
                Icon={
                  <FontAwesome5
                    name="angle-right"
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
                autoCapitalize="none"
              />
              <AutoCompleteBox
                show={showToSuggestions}
                closePanel={closeAllSuggest}
                results={predictions?.map((i) => {
                  return {
                    name: i.name,
                    formatted_address: i.formatted_address,
                  };
                })}
                onPressResult={(value) => {
                  setDeliveryAddress(value);
                  handleChange("to")(value);
                  const targetAdd = predictions.find(
                    (i) => i.formatted_address === value
                  );
                  handleChange("deliveryAddress")(`${targetAdd.name} ${value}`);
                  handleChange("deliveryAddressPlaceId")(targetAdd.place_id);
                  setDeliveryPoint({
                    latitude: targetAdd.latitude,
                    longitude: targetAdd.longitude,
                  });
                  setRegion({
                    latitude: targetAdd.latitude,
                    longitude: targetAdd.longitude,
                    latitudeDelta: 0.1922,
                    longitudeDelta: 0.0421,
                  });
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
                showsUserLocation={true}
              >
                {pickUPoint && deliveryPoint && (
                  <MapViewDirections
                    lineDashPattern={[0]}
                    origin={{ ...pickUPoint }}
                    destination={{ ...deliveryPoint }}
                    apikey="AIzaSyAPHNQTmBHXh6-lJaWmIMFbRikrrkncssk"
                    mode="DRIVING"
                    timePrecision="now"
                    strokeWidth={3}
                    strokeColor="hotpink"
                    tappable
                    geodesic
                    onError={(errorMessage) => {
                      showToast(
                        "We cannot deliver to this destination by transit."
                      );
                    }}
                  />
                )}
                {deliveryPoint && (
                  <Marker
                    coordinate={deliveryPoint}
                    title="Delivery Point"
                    description={deliveryAddress}
                    pinColor={colors.primary}
                  >
                    <Ionicons
                      name="location"
                      size={25}
                      color={colors.primary}
                    />
                  </Marker>
                )}
                {pickUPoint && (
                  <Marker
                    coordinate={pickUPoint}
                    title="Pick Up Point"
                    description={pickUpAddress}
                    pinColor={colors.primary}
                  >
                    <Ionicons
                      name="location"
                      size={25}
                      color={colors.primary}
                    />
                  </Marker>
                )}
              </MapView>
            </View>
          </ScrollView>

          <View style={styles.button}>
            <AppButton
              title={
                loadingLatLong ? (
                  <ActivityIndicator
                    animating={loadingLatLong}
                    color={colors.white}
                    size="large"
                  />
                ) : (
                  "Done"
                )
              }
              fullWidth
              onPress={handleSubmit}
              disabled={loadingLatLong}
            />
          </View>
          {packages.length > 0 && (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 10,
                right: 20,
                backgroundColor: colors.primary,
                padding: 5,
                borderRadius: 15,
                paddingHorizontal: 10,
              }}
              onPress={() => {
                const removeLastItem = packages;
                removeLastItem.pop();
                setPackages(removeLastItem);
                props.navigation.navigate("PackageSummaryScreenNew");
              }}
            >
              <AppText size="xx-small">Go back to summary</AppText>
            </TouchableOpacity>
          )}

          <AppModal isVisble={differentRegionError}>
            <View style={styles.modalBox}>
              <View style={styles.modalContainer}>
                <Ionicons
                  name="close-circle"
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
                  title="Choose Inter-City"
                  style={{ marginVertical: 10 }}
                  onPress={() => {
                    setOpenJourneyTypePanel(true);
                    setDifferentRegionError(false);
                    // props.navigation.goBack();
                  }}
                />
                <AppButton
                  title="Change My Address"
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
                  name="close-circle"
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
                  title="Choose Intra-city"
                  style={{ marginVertical: 10 }}
                  onPress={() => {
                    setSameRegionError(false);
                    setOpenJourneyTypePanel(true);
                  }}
                />
                <AppButton
                  title="Change My Address"
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
        </KeyboardAvoidingView>
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
    maxHeight: 300,
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
export default EnterLocationScreen;

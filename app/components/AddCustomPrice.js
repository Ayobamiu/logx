/** @format */

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import colors from "../config/colors";
import showToast from "../config/showToast";
import AppButton from "./AppButton";
import AppTextInput from "./AppTextInput";
import AppText from "./AppText";

function AddCustomPrice({
  visible,
  toggleModal,
  onSubmit,
  estimatedPrice,
  journeyType,
}) {
  const [selectedPrice, setSelectedPrice] = useState(Number(estimatedPrice));
  const [price, setPrice] = useState();
  const [priceSuggestions, setPriceSuggestions] = useState([
    Number(estimatedPrice + 1000),
    Number(estimatedPrice + 2000),
    Number(estimatedPrice + 3000),
  ]);
  useEffect(() => {
    let mounted = true;
    if (
      estimatedPrice - 10000 > 0 &&
      !priceSuggestions.includes(estimatedPrice - 10000)
    ) {
      if (mounted) {
        setPriceSuggestions((r) => [...r, estimatedPrice - 10000]);
      }
    }
    if (
      estimatedPrice - 20000 > 0 &&
      !priceSuggestions.includes(estimatedPrice - 20000)
    ) {
      if (mounted) {
        setPriceSuggestions((r) => [...r, estimatedPrice - 20000]);
      }
    }
    if (
      estimatedPrice - 500 > 0 &&
      !priceSuggestions.includes(estimatedPrice - 500)
    ) {
      if (mounted) {
        setPriceSuggestions((r) => [...r, estimatedPrice - 500]);
      }
    }
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <Modal visible={visible} transparent>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""}>
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            width: "100%",
            height: "100%",
          }}>
          <Pressable style={{ flex: 0.5, flexGrow: 1 }} onPress={toggleModal} />
          <View
            style={{
              width: "100%",
              borderTopRightRadius: 15,
              borderTopLeftRadius: 16,
              backgroundColor: colors.white,
              flexShrink: 1,
              flexGrow: 1,
              padding: 32,
            }}>
            <View>
              {journeyType === "intra-state" && (
                <AppText style={styles.mv10}>Estimated price.</AppText>
              )}
              {journeyType === "intra-state" && (
                <AppButton
                  style={{
                    alignSelf: "flex-start",
                    borderWidth: 1,
                    borderColor: colors.primary,
                    margin: 3,
                  }}
                  title={estimatedPrice.toLocaleString("us-US", {
                    style: "currency",
                    currency: "NGN",
                  })}
                  secondary={selectedPrice !== estimatedPrice}
                  onPress={() => {
                    if (selectedPrice === estimatedPrice) {
                      setSelectedPrice();
                    } else {
                      setSelectedPrice(estimatedPrice);
                    }
                  }}
                  small
                />
              )}
              <AppText style={styles.mv10}>
                Select a price you would like to pay for the trip
              </AppText>

              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  marginVertical: 4,
                  alignItems: "center",
                  borderRadius: 3,
                  padding: 8,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}>
                {priceSuggestions.map((p, index) => (
                  <AppButton
                    key={index}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.primary,
                      margin: 3,
                    }}
                    onPress={() => {
                      if (selectedPrice === p) {
                        setSelectedPrice();
                      } else {
                        setSelectedPrice(p);
                      }
                    }}
                    secondary={selectedPrice !== p}
                    title={p.toLocaleString("us-US", {
                      style: "currency",
                      currency: "NGN",
                    })}
                    small
                  />
                ))}
              </View>

              <AppText style={styles.mv10}>Input a custom price.</AppText>
              <AppTextInput
                style={[styles.mv10, { padding: 10 }]}
                defaultValue={price?.toString()}
                onChangeText={(text) => {
                  setPrice(Number(text));
                }}
                keyboardType='number-pad'
                returnKeyType='done'
                placeholder='Price'
              />
              <AppButton
                title='Add custom price'
                style={{
                  borderColor: colors.black,
                  borderWidth: 1,
                  paddingHorizontal: 40,
                }}
                small
                secondary
                onPress={() => {
                  if (price) {
                    if (priceSuggestions.includes(price)) {
                      showToast("Price already suggested");
                    } else {
                      setPriceSuggestions((r) => [...r, price]);
                      setSelectedPrice(Number(price));
                      setPrice();
                    }
                  } else {
                    showToast("Enter Price");
                  }
                }}
              />
              <View
                style={[
                  styles.row,
                  {
                    width: "100%",
                    justifyContent: "space-between",
                    marginTop: 30,
                  },
                ]}>
                <AppButton
                  title='Go back'
                  secondary
                  style={{
                    borderColor: colors.black,
                    borderWidth: 1,
                    paddingHorizontal: 40,
                  }}
                  onPress={toggleModal}
                />
                <AppButton
                  title='Submit'
                  style={{
                    paddingHorizontal: 40,
                  }}
                  onPress={() => {
                    if (selectedPrice) {
                      onSubmit(selectedPrice);
                      toggleModal();
                    } else {
                      showToast("Select a price.");
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {},
  full_width: { flex: 1, height: "100%" },
  mv10: { marginVertical: 10 },
  picker: {
    borderLeftColor: colors.secondary,
    borderLeftWidth: 1,
    width: 120,
    height: "100%",
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },
  pickedItem: {
    backgroundColor: colors.light,
    height: "100%",
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    borderRadius: 5,
  },
  pickerItem: {
    backgroundColor: colors.white,
    height: "100%",
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  pickedItemText: { fontWeight: "bold", color: colors.white },
  pickerItemText: { fontWeight: "bold", color: colors.black },
  row: { flexDirection: "row", alignItems: "center" },
});
export default AddCustomPrice;

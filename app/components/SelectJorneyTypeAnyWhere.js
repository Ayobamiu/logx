/** @format */

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";
import PromptBottomSheet from "./PromptBottomSheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { get, store } from "../utility/cache";
import AppButton from "./AppButton";
import useLocation from "../hooks/useLocation";

function SelectJorneyTypeAnyWhere({
  visible,
  toggleModal,
  onContinue = () => {},
}) {
  const { address } = useLocation();

  const [journeyType, setJourneyType] = useState("");

  useEffect(() => {
    (async () => {
      const type = await get("journey:type");
      setJourneyType(type);
    })();
  }, [journeyType]);
  return (
    <PromptBottomSheet isVisble={visible} toggleModal={toggleModal}>
      <AppText style={[styles.black, styles.bold, styles.mb16]}>
        Choose type of destination
      </AppText>
      <Pressable
        style={[
          styles.paymentMethodButton,
          journeyType === "intra-state" && styles.selectedButton,
        ]}
        onPress={async () => {
          await store("journey:type", "intra-state");
          setJourneyType("intra-state");
        }}>
        <View>
          <AppText style={styles.bold}>Intra-City </AppText>
          <AppText style={{}}>
            Sending within {address?.region || "your city"}
          </AppText>
        </View>
        <MaterialCommunityIcons
          name='circle-outline'
          size={15}
          color={journeyType === "intra-state" ? colors.primary : "black"}
          style={{ marginLeft: "auto" }}
        />
      </Pressable>
      <Pressable
        style={[
          styles.paymentMethodButton,
          journeyType === "inter-state" && styles.selectedButton,
        ]}
        onPress={async () => {
          await store("journey:type", "inter-state");
          setJourneyType("inter-state");
        }}>
        <View>
          <AppText style={styles.bold}>Inter-City </AppText>
          <AppText style={{}}>
            Sending outside of {address?.region || "your city"}
          </AppText>
        </View>
        <MaterialCommunityIcons
          name='circle-outline'
          size={15}
          color={journeyType === "inter-state" ? colors.primary : "black"}
          style={{ marginLeft: "auto" }}
        />
      </Pressable>
      <AppButton
        title='Continue'
        style={{ marginVertical: 10 }}
        onPress={() => {
          toggleModal();
          onContinue(journeyType);
        }}
      />
    </PromptBottomSheet>
  );
}
const styles = StyleSheet.create({
  black: { color: colors.black },
  bold: { fontWeight: "bold" },
  container: {},
  mb16: { marginBottom: 16 },
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
  selectedButton: {
    backgroundColor: colors.opaquePrimary,
    borderColor: colors.primary,
  },
});
export default SelectJorneyTypeAnyWhere;

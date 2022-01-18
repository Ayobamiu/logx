import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AppModal from "./AppModal";
import colors from "../config/colors";
import AppText from "./AppText";
import AppButton from "./AppButton";

function PromptBottomSheet({ toggleModal, isVisble = true, children }) {
  const [showSelectPayment, setShowSelectPayment] = useState(false);
  return (
    <AppModal isVisble={isVisble} toggleModal={toggleModal}>
      <View
        style={{
          height: "100%",
          alignItems: "center",
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.5)",
          //   paddingHorizontal: 10,
        }}
      >
        <Pressable
          style={{
            width: "100%",
            // backgroundColor: colors.red,
            alignSelf: "center",
            flex: 1,
          }}
          onPress={toggleModal}
        />
        <View
          style={{
            backgroundColor: colors.white,
            width: "100%",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            minHeight: 100,
          }}
        >
          <Pressable
            style={{
              width: 60,
              height: 5,
              backgroundColor: colors.grey,
              alignSelf: "center",
              marginBottom: 20,
              borderRadius: 5,
            }}
            onPress={toggleModal}
          />
          {children}
        </View>
      </View>
    </AppModal>
  );
}
const styles = StyleSheet.create({
  container: {},
});
export default PromptBottomSheet;

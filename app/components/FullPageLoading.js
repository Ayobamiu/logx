import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import colors from "../config/colors";

const FullPageLoading = ({ toggleModal, isVisble = true, children }) => {
  return (
    <Modal
      animationType="slide"
      visible={isVisble}
      onRequestClose={() => {
        toggleModal(!isVisble);
      }}
      statusBarTranslucent
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <ActivityIndicator
          color={colors.primary}
          animating={true}
          size="large"
        />
      </View>
    </Modal>
  );
};

export default FullPageLoading;

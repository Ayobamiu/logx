import React from "react";
import { Modal } from "react-native";

const AppModal = ({ toggleModal, isVisble = true, children }) => {
  return (
    <Modal
      animationType="slide"
      visible={isVisble}
      onRequestClose={() => {
        toggleModal(!isVisble);
      }}
      statusBarTranslucent
      transparent
    >
      {children}
    </Modal>
  );
};

export default AppModal;

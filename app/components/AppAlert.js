import React from "react";
import { Alert, Modal, StyleSheet, View } from "react-native";

const AppAlert = ({ toggleModal, isVisble = true, children }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisble}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        toggleModal(!isVisble);
      }}
      statusBarTranslucent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.15)",
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    maxWidth: "70%",
    borderRadius: 16,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default AppAlert;

/** @format */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import colors from "../config/colors";
import showToast from "../config/showToast";
import AppButton from "./AppButton";
import AppText from "./AppText";

function AddExtraTime({ visible, toggleModal, onSubmit }) {
  const [timeFormat, setTimeFormat] = useState("H");
  const [timeValue, setTimeValue] = useState();

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
              flex: 0.5,
              width: "100%",
              borderTopRightRadius: 15,
              borderTopLeftRadius: 16,
              backgroundColor: colors.white,
              padding: 32,
              flexShrink: 1,
            }}>
            <View>
              <AppText size='medium'>Add Extra time</AppText>
              <AppText style={styles.mv10}>Time</AppText>
              <View
                style={{
                  backgroundColor: colors.inputGray,
                  flexDirection: "row",
                  width: "100%",
                  marginVertical: 4,
                  alignItems: "center",
                  height: 47,
                  borderRadius: 3,
                  padding: 8,
                }}>
                <TextInput
                  style={styles.full_width}
                  defaultValue={timeValue?.toString()}
                  onChangeText={(text) => {
                    setTimeValue(Number(text));
                  }}
                  keyboardType='number-pad'
                  returnKeyType='done'
                />
                <View style={styles.picker}>
                  <Pressable
                    style={[
                      timeFormat === "H"
                        ? styles.pickedItem
                        : styles.pickerItem,
                    ]}
                    onPress={() => setTimeFormat("H")}>
                    <AppText
                      style={[
                        timeFormat === "H"
                          ? styles.pickedItemText
                          : styles.pickerItemText,
                      ]}>
                      H
                    </AppText>
                  </Pressable>
                  <Pressable
                    style={[
                      timeFormat === "M"
                        ? styles.pickedItem
                        : styles.pickerItem,
                    ]}
                    onPress={() => setTimeFormat("M")}>
                    <AppText
                      style={[
                        timeFormat === "M"
                          ? styles.pickedItemText
                          : styles.pickerItemText,
                      ]}>
                      M
                    </AppText>
                  </Pressable>
                  {/* <Picker
                    selectedValue={"Hours"}
                    onValueChange={(itemValue, itemIndex) => {
                      setTimeFormat(itemValue);
                    }}
                  >
                    <Picker.Item
                      label="Hours"
                      value="Hours"
                      style={{ color: colors.light }}
                    />
                    <Picker.Item
                      label="Minutes"
                      value="Minutes"
                      style={{ color: colors.light }}
                    />
                  </Picker> */}
                </View>
              </View>
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
                    let seconds = 0;
                    if (timeValue) {
                      if (timeFormat === "H") {
                        seconds = timeValue * 60 * 60;
                      }
                      if (timeFormat === "M") {
                        seconds = timeValue * 60;
                      }
                      onSubmit(seconds);
                      toggleModal();
                    } else {
                      showToast("Enter a time value");
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
export default AddExtraTime;

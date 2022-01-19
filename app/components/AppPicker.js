/** @format */

import React, { useState } from "react";
import { View, StyleSheet, Modal, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import colors from "../config/colors";
import AppText from "./AppText";
import { Ionicons } from "@expo/vector-icons";

function AppPicker({
  title,
  white = false,
  selectedValue,
  setSelectedValue,
  data = [],
  placeholder = "Select..",
}) {
  const [showModal, setShowModal] = useState(false);
  return (
    <View>
      {title && (
        <AppText size='medium' fontWeight='medium' style={styles.title}>
          {title}
        </AppText>
      )}
      <Pressable
        style={[
          styles.container,
          {
            backgroundColor: white ? colors.white : colors.inputGray,
            paddingHorizontal: 10,
          },
        ]}
        onPress={() => setShowModal(true)}>
        <AppText size='medium' fontWeight='medium' style={styles.title}>
          {data.find((i) => i.value === selectedValue)?.label || placeholder}
        </AppText>
      </Pressable>
      <Modal transparent visible={showModal}>
        <View
          style={{
            width: "100%",
            height: "100%",
          }}>
          <Pressable
            style={{
              flex: 0.5,
            }}
          />
          <View
            style={{
              backgroundColor: colors.white,
              flex: 0.5,
            }}>
            <Pressable
              style={{
                borderTopColor: colors.grey,
                borderTopWidth: 1,
                borderBottomColor: colors.grey,
                borderBottomWidth: 1,
                padding: 15,
                flexDirection: "row",
                justifyContent: "space-between",
              }}>
              <Ionicons
                name='close'
                size={20}
                onPress={() => setShowModal(false)}
              />
              <AppText
                style={{ color: colors.primary, fontWeight: "bold" }}
                onPress={() => setShowModal(false)}>
                Done
              </AppText>
            </Pressable>

            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }>
              <Picker.Item label={placeholder} enabled={false} />
              {data.map((i, index) => (
                <Picker.Item label={i?.label} value={i?.value} key={index} />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 4,
    height: 47,
    justifyContent: "center",
  },
  title: {
    fontSize: 13,
    color: colors.title,
  },
});
export default AppPicker;

import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import colors from "../config/colors";
import AppText from "./AppText";

function AppPicker({
  title,
  white = false,
  selectedValue,
  setSelectedValue,
  data = [],
  placeholder = "Select..",
}) {
  return (
    <View>
      {title && (
        <AppText size="medium" fontWeight="medium" style={styles.title}>
          {title}
        </AppText>
      )}
      <View
        style={[
          styles.container,
          { backgroundColor: white ? colors.white : colors.inputGray },
        ]}
      >
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        >
          <Picker.Item label={placeholder} enabled={false} />
          {data.map((i, index) => (
            <Picker.Item label={i?.label} value={i?.value} key={index} />
          ))}
        </Picker>
      </View>
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

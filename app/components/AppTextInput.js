/** @format */

import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import AppText from "./AppText";
import colors from "../config/colors";

function AppTextInput({
  placeholder,
  rounded,
  onChangeText,
  onPressControlText = () => {},
  onPressShowPassword = () => {},
  white = false,
  secureTextEntry = false,
  style,
  title,
  Icon,
  keyboardType,
  controlText,
  ...otherProps
}) {
  const [hide, setHide] = useState(false);
  const [focused, setfocused] = useState(false);
  return (
    <View>
      {title && (
        <AppText
          size='medium'
          fontWeight='medium'
          style={styles.title}
          onPress={onPressShowPassword}>
          {title}
        </AppText>
      )}
      <View
        style={[
          styles.container,
          { backgroundColor: white ? colors.white : colors.inputGray },
          rounded ? styles.rounded : styles.box,
          style,
          focused && styles.bordered,
        ]}>
        <TextInput
          placeholderTextColor={colors.light}
          style={[styles.placeHolderText, styles.full_width]}
          {...otherProps}
          onChangeText={onChangeText}
          placeholder={placeholder}
          textAlignVertical={otherProps.multiline && "top"}
          secureTextEntry={hide}
          keyboardType={keyboardType}

          // onBlur={() => setfocused(false)}
          // onFocus={() => setfocused(true)}
        />
        {secureTextEntry && (
          <AppText style={styles.showPassword} onPress={() => setHide(!hide)}>
            {hide ? "Show" : "Hide"}
          </AppText>
        )}
        {controlText && (
          <AppText style={styles.showPassword} onPress={onPressControlText}>
            {controlText}
          </AppText>
        )}
        {Icon}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bordered: { borderWidth: 3, borderColor: colors.gray },
  box: { borderRadius: 3 },
  container: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 4,
    alignItems: "center",
    minHeight: 47,
  },
  full_width: { flex: 1, height: "100%" },
  placeHolderText: {
    fontSize: 16,
  },
  rounded: { borderRadius: 100 },
  showPassword: { color: colors.primary, fontSize: 13 },
  text: {
    color: colors.medium,
    fontSize: 12,
  },
  title: {
    fontSize: 13,
    color: colors.title,
  },
});
export default AppTextInput;

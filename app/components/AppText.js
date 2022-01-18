import React from "react";
import { Text } from "react-native";

function AppText({
  children,
  size,
  fontWeight,
  style: extraStyle,
  onPress,
  ...props
}) {
  const textSize =
    size === "large"
      ? 30
      : size === "header"
      ? 24
      : size === "medium"
      ? 20
      : size === "16"
      ? 16
      : size === "x-small"
      ? 12
      : 14;

  const style = {
    fontSize: textSize,
  };

  return (
    <Text style={[style, extraStyle]} {...props} onPress={onPress}>
      {children}
    </Text>
  );
}

export default AppText;

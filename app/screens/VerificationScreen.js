/** @format */

import React, { useContext } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import {
  Ionicons,
  Fontisto,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import AppText from "../components/AppText";
import colors from "../config/colors";
import AuthContext from "../contexts/auth";

function VerificationScreen(props) {
  const { user, setUser } = useContext(AuthContext);

  const VerificationItem = ({
    IconComponent,
    onPress,
    title,
    uploaded = false,
  }) => {
    return (
      <Pressable onPress={onPress} style={[styles.row, { marginVertical: 8 }]}>
        {IconComponent}
        <AppText size='16' style={[styles.mh10, styles.bold]}>
          {title}
        </AppText>
        {uploaded ? (
          <Ionicons
            color={colors.success}
            size={16}
            name='checkmark-circle'
            style={[styles.mh10, { marginLeft: "auto" }]}
          />
        ) : (
          <Ionicons
            color={colors.red}
            size={16}
            name='alert-circle-outline'
            style={[styles.mh10, { marginLeft: "auto" }]}
          />
        )}

        <Fontisto
          name='angle-right'
          size={16}
          color={colors.black}
          style={styles.mh10}
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <VerificationItem
        IconComponent={
          <View
            style={[styles.avatar, { backgroundColor: colors.opaquePrimary }]}>
            <MaterialIcons
              name='add-a-photo'
              size={30}
              color={colors.primary}
            />
          </View>
        }
        onPress={() => {
          props.navigation.navigate("UploadPictureScreen");
        }}
        title='Upload your picture'
        uploaded={user.verificationPhoto}
      />
      <VerificationItem
        IconComponent={
          <View
            style={[styles.avatar, { backgroundColor: colors.dangerLight }]}>
            <AntDesign name='idcard' size={30} color={colors.danger} />
          </View>
        }
        onPress={() => {
          props.navigation.navigate("UploadDocumentsScreen");
        }}
        title='ID Document'
        uploaded={
          user.nationalId || user.votersCard || user.internationalPassport
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  avatar: {
    width: 55,
    height: 55,

    borderRadius: 55 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  bold: { fontWeight: "bold" },
  container: { padding: 16, backgroundColor: colors.white, flex: 1 },
  mh10: { marginHorizontal: 10 },
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
});
export default VerificationScreen;

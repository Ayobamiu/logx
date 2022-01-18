import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import colors from "../config/colors";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import ConversationItem from "../components/ConversationItem";

function DriverProfileScreen(props) {
  const [showing, setShowing] = useState("about");
  const [messages, setMessages] = useState([1, 2, 3, 4, 5, 6]);
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          props.navigation.goBack();
        }}
        style={styles.backButton}
      >
        <Ionicons
          name="arrow-back"
          size={20}
          onPress={() => {
            props.navigation.goBack();
          }}
        />
      </Pressable>
      <View style={styles.profileDetails}>
        <View style={styles.blue}>
          <Ionicons name="image" color={colors.black} size={50} />
        </View>
        <View style={styles.white}>
          <ImageBackground style={styles.avatar}>
            <FontAwesome5 name="user" color={colors.secondary} size={35} />
          </ImageBackground>
          <View style={styles.column}>
            <AppText size="medium">Adekola James Ajakaiye</AppText>
            <View style={[styles.row]}>
              <Ionicons name="star" color={colors.primary} size={15} />
              <Ionicons name="star" color={colors.primary} size={15} />
              <Ionicons name="star" color={colors.primary} size={15} />
              <Ionicons name="star" color={colors.primary} size={15} />
              <Ionicons name="star" color={colors.greyBg} size={15} />
              <AppText size="16">
                4.5
                <AppText size="x-small" style={styles.light}>
                  {" "}
                  (110 deliveries)
                </AppText>
              </AppText>
            </View>
            <View style={[styles.row, styles.mt10]}>
              <View style={styles.iconWrap}>
                <Ionicons
                  name="md-send-sharp"
                  color={colors.danger}
                  size={15}
                />
              </View>
              <View style={styles.iconWrap}>
                <Ionicons name="call" color={colors.success} size={15} />
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.aboutAndReviews}>
        <View style={[styles.selectButtons, styles.row]}>
          <Pressable
            style={[
              styles.selectButton,
              showing === "about" ? styles.selected : styles.unselected,
            ]}
            onPress={() => setShowing("about")}
          >
            <AppText
              style={[
                showing === "about"
                  ? styles.selectedText
                  : styles.unselectedText,
              ]}
            >
              About
            </AppText>
          </Pressable>
          <Pressable
            style={[
              styles.selectButton,
              showing === "reviews" ? styles.selected : styles.unselected,
            ]}
            onPress={() => setShowing("reviews")}
          >
            <AppText
              style={[
                showing === "reviews"
                  ? styles.selectedText
                  : styles.unselectedText,
              ]}
            >
              Reviews
            </AppText>
          </Pressable>
        </View>
        {showing === "about" && (
          <ScrollView
            contentContainerStyle={styles.ph32}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.mt10}>
              <AppText style={[styles.unselectedText]}>Reviews</AppText>
              <AppText size="16" style={[styles.black]}>
                Adekola James Ajakaiye
              </AppText>
            </View>
            <View style={styles.mt10}>
              <AppText style={[styles.unselectedText]}>Joined on</AppText>
              <AppText size="16" style={[styles.black]}>
                Saturday, June 12, 2021. 4:50pm
              </AppText>
            </View>
            <View style={styles.mt10}>
              <AppText style={[styles.unselectedText]}>
                No. of successful Deliveries
              </AppText>
              <AppText size="16" style={[styles.black]}>
                123
              </AppText>
            </View>
            <View style={styles.mt10}>
              <AppText style={[styles.unselectedText]}>Ratings</AppText>
              <View style={[styles.row]}>
                <Ionicons name="star" color={colors.primary} size={15} />
                <Ionicons name="star" color={colors.primary} size={15} />
                <Ionicons name="star" color={colors.primary} size={15} />
                <Ionicons name="star" color={colors.primary} size={15} />
                <Ionicons name="star" color={colors.greyBg} size={15} />
                <AppText size="16">
                  4.5
                  <AppText size="x-small" style={styles.light}>
                    {" "}
                    (110 deliveries)
                  </AppText>
                </AppText>
              </View>
            </View>
          </ScrollView>
        )}
        {showing === "reviews" && (
          <ScrollView
            contentContainerStyle={styles.ph32}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {messages.map((i, index) => (
              <ConversationItem key={index} />
            ))}
          </ScrollView>
        )}
      </View>
      <View style={[styles.mtAuto]}>
        <AppButton
          title="Connect with driver"
          fullWidth
          onPress={() => {
            props.navigation.navigate("TransactionDetailsScreen");
          }}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  aboutAndReviews: {
    flex: 1,
    backgroundColor: colors.white,
  },
  avatar: {
    width: 85,
    height: 85,
    backgroundColor: colors.grey,
    borderRadius: 85 / 2,
    top: -85 / 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",

    position: "absolute",
  },
  backButton: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    top: 32,
    left: 32,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  black: { color: colors.secondary },
  blue: {
    backgroundColor: colors.secondary,
    height: 120,
    justifyContent: "center",

    alignItems: "center",
  },
  column: {
    flexDirection: "column",
    justifyContent: "center",

    alignItems: "center",
    marginTop: 85 / 2,
  },
  container: {
    flex: 1,
  },
  iconWrap: {
    width: 33.57,
    height: 33.57,
    borderRadius: 33.57 / 2,
    backgroundColor: colors.greyBg,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  mtAuto: {
    position: "absolute",
    bottom: 16,
    paddingHorizontal: 32,
    width: "100%",
  },
  mt10: { marginTop: 10 },
  ph32: { paddingHorizontal: 32, paddingVertical: 16 },
  profileDetails: {
    backgroundColor: colors.white,
    paddingBottom: 30,
  },
  row: { flexDirection: "row", alignItems: "center" },
  selected: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
  },
  selectedText: {
    color: colors.primary,
  },
  selectButton: {
    flex: 0.5,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  selectButtons: {
    borderTopWidth: 0.5,
    borderTopColor: colors.light,
    height: 50,
    flexDirection: "row",
  },
  unselected: {
    borderBottomColor: colors.light,
    borderBottomWidth: 2,
  },
  unselectedText: {
    color: colors.light,
  },
});
export default DriverProfileScreen;

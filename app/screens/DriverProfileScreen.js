/** @format */

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import colors from "../config/colors";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import reviewApi from "../api/reviews";
import ReviewAndRatingItem from "../components/ReviewAndRatingItem";
import auth from "../api/auth";
import AuthContext from "../contexts/auth";

function DriverProfileScreen(props) {
  const [showing, setShowing] = useState("about");
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profile, setProfile] = useState(null);
  const ratings = [1, 2, 3, 4, 5];

  const { user } = useContext(AuthContext);
  const userId = props.route?.params?.userId;
  console.log("userId", userId);

  const getUserProfile = async (userId) => {
    setLoadingProfile(true);

    const { data, error } = await auth.getUserProfile(userId);
    if (!error && data) {
      setProfile(data);
    }
    setLoadingProfile(false);
  };
  const getMyReviews = async () => {
    setLoadingReviews(true);

    const { data, error } = await reviewApi.getMyReviews();
    if (!error && data) {
      setReviews(data);
    }
    setLoadingReviews(false);
  };
  const getUserReviews = async (userId) => {
    setLoadingReviews(true);

    const { data, error } = await reviewApi.getUserReviews(userId);
    if (!error && data) {
      setReviews(data);
    }
    setLoadingReviews(false);
  };
  useEffect(() => {
    if (userId) {
      getUserReviews(userId);
      getUserProfile(userId);
    } else {
      getMyReviews();
      getUserProfile(user._id);
    }
  }, []);

  const sum = profile?.ratings?.reduce((a, b) => a + b, 0);
  const userRating = sum / profile?.ratings?.length || 0;
  const AboutMe = () => {
    if (showing !== "about") return null;
    return (
      <ScrollView
        contentContainerStyle={styles.ph32}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {loadingProfile && (
          <ActivityIndicator
            animating={loadingProfile}
            color={colors.primary}
          />
        )}
        <View style={styles.mt10}>
          <AppText style={[styles.unselectedText]}>Name</AppText>
          <AppText size='16' style={[styles.black]}>
            {profile?.firstName} {profile?.lastName}
          </AppText>
        </View>
        <View style={styles.mt10}>
          <AppText style={[styles.unselectedText]}>Joined on</AppText>
          <AppText size='16' style={[styles.black]}>
            {profile?.createdAt
              ? new Date(profile?.createdAt).toDateString()
              : "Not Available"}
          </AppText>
        </View>
        <View style={styles.mt10}>
          <AppText style={[styles.unselectedText]}>
            No. of successful Deliveries
          </AppText>
          <AppText size='16' style={[styles.black]}>
            {profile?.trips}
          </AppText>
        </View>
        <View style={styles.mt10}>
          <AppText style={[styles.unselectedText]}>Ratings</AppText>
          <View style={[styles.row]}>
            {/* <Ionicons name='star' color={colors.primary} size={15} />
            <Ionicons name='star' color={colors.primary} size={15} />
            <Ionicons name='star' color={colors.primary} size={15} />
            <Ionicons name='star' color={colors.primary} size={15} />
          */}
            {/* <Ionicons name='star-outline' color={colors.greyBg} size={15} /> */}
            <View
              style={[
                styles.row,
                { justifyContent: "space-around" },
                styles.mv10,
              ]}>
              {ratings.map((i, index) => (
                <Ionicons
                  key={index}
                  name={i > userRating ? "star-outline" : "star"}
                  size={15}
                  color={i > userRating ? colors.black : colors.primary}
                />
              ))}
            </View>
            <AppText size='16'>
              {userRating}
              <AppText size='x-small' style={styles.light}>
                {" "}
                ({profile?.trips} deliveries)
              </AppText>
            </AppText>
          </View>
        </View>
      </ScrollView>
    );
  };

  const Reviews = () => {
    if (showing !== "reviews") return null;
    return (
      <FlatList
        contentContainerStyle={[
          styles.container,
          { padding: 16, backgroundColor: colors.white },
        ]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={reviews}
        renderItem={({ item }) => (
          <ReviewAndRatingItem
            createdAt={item.createdAt}
            comment={item.comment}
            rating={item.rating}
            sender={item.sender}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.empty}>
            {loadingReviews && (
              <ActivityIndicator
                animating={loadingReviews}
                color={colors.primary}
              />
            )}
            <AppText>Your reviews will show here</AppText>
          </View>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          props.navigation.goBack();
        }}
        style={styles.backButton}>
        <Ionicons
          name='arrow-back'
          size={20}
          onPress={() => {
            props.navigation.goBack();
          }}
        />
      </Pressable>
      <View style={styles.profileDetails}>
        <View style={styles.blue}>
          <Ionicons name='image' color={colors.black} size={50} />
        </View>
        <View style={styles.white}>
          <ImageBackground
            style={styles.avatar}
            borderRadius={85 / 2}
            source={{ uri: profile?.profilePhoto }}>
            {!profile?.profilePhoto && (
              <FontAwesome5 name='user' color={colors.secondary} size={35} />
            )}
          </ImageBackground>
          <View style={styles.column}>
            {loadingProfile && (
              <ActivityIndicator
                animating={loadingProfile}
                color={colors.primary}
              />
            )}
            <AppText size='medium'>
              {profile?.firstName} {profile?.lastName}
            </AppText>
            <View style={[styles.row]}>
              <Ionicons name='star' color={colors.primary} size={15} />
              <Ionicons name='star' color={colors.primary} size={15} />
              <Ionicons name='star' color={colors.primary} size={15} />
              <Ionicons name='star' color={colors.primary} size={15} />
              <Ionicons name='star' color={colors.greyBg} size={15} />
              <AppText size='16'>
                4.5
                <AppText size='x-small' style={styles.light}>
                  ({profile?.trips} deliveries)
                </AppText>
              </AppText>
            </View>
            <View style={[styles.row, styles.mt10]}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`mailto: ${profile?.email}`);
                }}
                style={styles.iconWrap}>
                <Ionicons
                  name='md-send-sharp'
                  color={colors.danger}
                  size={15}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconWrap}
                onPress={() => {
                  Linking.openURL(`tel:${profile?.phoneNumber}`);
                }}>
                <Ionicons name='call' color={colors.success} size={15} />
              </TouchableOpacity>
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
            onPress={() => setShowing("about")}>
            <AppText
              style={[
                showing === "about"
                  ? styles.selectedText
                  : styles.unselectedText,
              ]}>
              About
            </AppText>
          </Pressable>
          <Pressable
            style={[
              styles.selectButton,
              showing === "reviews" ? styles.selected : styles.unselected,
            ]}
            onPress={() => setShowing("reviews")}>
            <AppText
              style={[
                showing === "reviews"
                  ? styles.selectedText
                  : styles.unselectedText,
              ]}>
              Reviews
            </AppText>
          </Pressable>
        </View>
        <AboutMe />
        <Reviews />
      </View>
      {profile?._id !== user._id && (
        <View style={[styles.mtAuto]}>
          <AppButton
            title='Connect with driver'
            fullWidth
            onPress={() => {
              props.navigation.navigate("TransactionDetailsScreen");
            }}
          />
        </View>
      )}
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
    left: 10,
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
  bold: { fontWeight: "bold" },

  column: {
    flexDirection: "column",
    justifyContent: "center",

    alignItems: "center",
    marginTop: 85 / 2,
  },
  container: {
    flex: 1,
  },
  empty: { minHeight: 200, justifyContent: "center", alignItems: "center" },

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
  separator: { height: 20, width: 10 },
  unselected: {
    borderBottomColor: colors.light,
    borderBottomWidth: 2,
  },
  unselectedText: {
    color: colors.light,
  },
});
export default DriverProfileScreen;

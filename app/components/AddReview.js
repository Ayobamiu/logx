/** @format */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  ScrollView,
} from "react-native";
import colors from "../config/colors";
import showToast from "../config/showToast";
import AppButton from "./AppButton";
import AppText from "./AppText";
import AppTextInput from "./AppTextInput";
import { AntDesign } from "@expo/vector-icons";
import reviewApi from "../api/reviews";

function AddReview({ visible, toggleModal, onSubmit, trip }) {
  const [timeFormat, setTimeFormat] = useState("H");
  const [timeValue, setTimeValue] = useState();
  const [rating, setRating] = useState(0);
  const [addingReview, setAddingReview] = useState(false);
  const [comment, setComment] = useState("");
  const ratings = [1, 2, 3, 4, 5];
  const ratingsText = [
    "It was poor.",
    "It was fair.",
    "It was average.",
    "It was okay.",
    "It was great!",
  ];

  const handleSubmit = async () => {
    if (rating !== 0) {
      setAddingReview(true);

      const { data, error } = await reviewApi.addReview({
        user: trip.driver._id,
        trip: trip._id,
        comment,
        rating,
      });
      if (!error && data) {
        showToast("Review submitted");
      }
      setAddingReview(false);
      toggleModal();
    } else {
      showToast("Select a rating");
    }
  };

  return (
    <Modal visible={visible} transparent>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""}>
        <ScrollView
          contentContainerStyle={{
            backgroundColor: "rgba(0,0,0,0.5)",
            width: "100%",
            height: "100%",
          }}>
          <Pressable style={{ flex: 0.5, flexGrow: 1 }} onPress={toggleModal} />
          <View
            style={{
              width: "100%",
              borderTopRightRadius: 15,
              borderTopLeftRadius: 16,
              backgroundColor: colors.white,
              padding: 32,
              flexGrow: 1,
            }}>
            <View>
              <AppText size='medium'>
                Drop your review <ActivityIndicator animating={addingReview} />{" "}
              </AppText>
              <AppText style={styles.mv10} size='title'>
                Choose a Rating
              </AppText>
              <View
                style={[
                  styles.row,
                  { justifyContent: "space-around" },
                  styles.mv10,
                ]}>
                {ratings.map((i, index) => (
                  <AntDesign
                    key={index}
                    name={i > rating ? "staro" : "star"}
                    size={35}
                    color={i > rating ? colors.black : colors.primary}
                    onPress={() => setRating(i)}
                  />
                ))}
              </View>
              {ratingsText[rating - 1] && (
                <AppText
                  style={[
                    styles.mv10,
                    { alignSelf: "flex-end", color: colors.primary },
                  ]}
                  size='title'>
                  {ratingsText[rating - 1]}
                </AppText>
              )}
              <AppText style={styles.mv10} size='title'>
                Write your comment
              </AppText>
              <AppTextInput
                placeholder='write your comment here...'
                multiline
                textAlignVertical='top'
                numberOfLines={3}
                onChangeText={(text) => setComment(text)}
              />

              <AppButton
                title='Submit your review'
                style={{
                  paddingHorizontal: 40,
                  marginVertical: 20,
                }}
                onPress={() => {
                  handleSubmit();
                }}
              />
            </View>
          </View>
        </ScrollView>
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
export default AddReview;

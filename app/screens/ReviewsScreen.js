/** @format */

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import ReviewAndRatingItem from "../components/ReviewAndRatingItem";
import colors from "../config/colors";
import reviewApi from "../api/reviews";

function ReviewsScreen(props) {
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const getMyReviews = async () => {
    setLoadingReviews(true);

    const { data, error } = await reviewApi.getMyReviews();
    if (!error && data) {
      setReviews(data);
    }
    setLoadingReviews(false);
  };
  useEffect(() => {
    getMyReviews();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    (async () => {
      getMyReviews();
      setRefreshing(false);
    })();
  }, []);
  return (
    <FlatList
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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
      ListHeaderComponent={
        <AppText style={[styles.bold, { marginBottom: 16 }]} size='header'>
          Reviews and Ratings{" "}
          <ActivityIndicator
            animating={loadingReviews}
            color={colors.primary}
          />
        </AppText>
      }
      // ListFooterComponent={() => (
      //   <View style={{ paddingHorizontal: 16 }}>
      //     {reviews.length > 0 && (
      //       <AppButton
      //         title='Load more Reviews'
      //         style={{ borderColor: colors.primary, borderWidth: 1 }}
      //         secondary
      //       />
      //     )}
      //   </View>
      // )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <AppText>Your reviews will show here</AppText>
        </View>
      }
    />
  );
}
const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  container: { padding: 16, backgroundColor: colors.white, flex: 1 },
  empty: { minHeight: 300, justifyContent: "center", alignItems: "center" },
  separator: { height: 20, width: 10 },
});
export default ReviewsScreen;

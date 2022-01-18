/** @format */

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import AppText from "../components/AppText";
import TransactionYellowItem from "../components/TransactionYellowItem";
import colors from "../config/colors";
import TripContext from "../contexts/trip";
import TripsContext from "../contexts/trips";
import placesApi from "../api/places";
import { FontAwesome5 } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";

function TransactionsScreen(props) {
  const [showing, setShowing] = useState("Ongoing");
  const { trips, setTrips } = useContext(TripsContext);
  let tripsToShow = trips;
  if (showing === "Completed") {
    tripsToShow = trips.filter((i) => i.status === "completed");
  } else {
    tripsToShow = trips.filter((i) => i.status !== "completed");
  }
  const { trip, setTrip } = useContext(TripContext);
  const [loadingtrips, setLoadingtrips] = useState(false);
  const loadTrips = async () => {
    setLoadingtrips(true);

    const { data, error } = await placesApi.getMyTrip();
    if (!error && data) {
      setTrips(data);
    }
    setLoadingtrips(false);
  };
  useEffect(() => {
    loadTrips();
  }, []);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    (async () => {
      await loadTrips();
      setRefreshing(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16 }}
        data={tripsToShow}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={[styles.selectButtons, styles.row, styles.mb10]}>
            <Pressable
              style={[
                styles.selectButton,
                showing === "Ongoing" ? styles.selected : styles.unselected,
              ]}
              onPress={() => setShowing("Ongoing")}>
              <AppText
                style={[
                  showing === "Ongoing"
                    ? styles.selectedText
                    : styles.unselectedText,
                ]}>
                Ongoing
              </AppText>
            </Pressable>
            <Pressable
              style={[
                styles.selectButton,
                showing === "Completed" ? styles.selected : styles.unselected,
              ]}
              onPress={() => setShowing("Completed")}>
              <AppText
                style={[
                  showing === "Completed"
                    ? styles.selectedText
                    : styles.unselectedText,
                ]}>
                Completed
              </AppText>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View
            style={[
              {
                justifyContent: "center",
                alignItems: "center",
                height: 300,
              },
              styles.mv10,
            ]}>
            <View style={styles.mv10}>
              <FontAwesome5 name='car-side' size={24} color='black' />
            </View>
            <AppText style={styles.mv10}>
              You {showing} Trips will Appear Here
            </AppText>
          </View>
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionYellowItem
            item={item}
            onPress={() => {
              setTrip(item);
              props.navigation.navigate("TransactionDetailsScreen", {
                item: item,
              });
            }}
          />
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mb10: { marginBottom: 10 },
  mv10: { marginVertical: 10 },
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
    height: 50,
    flexDirection: "row",
    backgroundColor: colors.white,
  },
  unselected: {
    borderBottomColor: colors.light,
    borderBottomWidth: 2,
  },
  unselectedText: {
    color: colors.light,
  },
});
export default TransactionsScreen;

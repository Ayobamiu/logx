/** @format */

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import AppText from "../components/AppText";
import TransactionYellowItem from "../components/TransactionYellowItem";
import colors from "../config/colors";
import TripContext from "../contexts/trip";
import TripsContext from "../contexts/trips";
import placesApi from "../api/places";
import { FontAwesome5 } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import AuthContext from "../contexts/auth";
import socket from "../api/socket";

function TransactionsScreen(props) {
  let mounted = true;
  const [showing, setShowing] = useState("Ongoing");
  const { trips, setTrips } = useContext(TripsContext);
  const { user, setUser } = useContext(AuthContext);

  let tripsToShow = trips.filter(
    (i) => i.status !== "completed" && i.status !== "cancelled"
  );
  if (showing === "Completed") {
    tripsToShow = trips.filter((i) => i.status === "completed");
  }
  if (showing === "Cancelled") {
    tripsToShow = trips.filter((i) => i.status === "cancelled");
  }
  const { trip, setTrip } = useContext(TripContext);
  const [loadingtrips, setLoadingtrips] = useState(false);
  const loadTrips = async () => {
    if (mounted) {
      setLoadingtrips(true);
    }

    const { data, error } = await placesApi.getMyTrip();
    if (!error && data) {
      if (mounted) {
        setTrips(data);
      }
    }
    if (mounted) {
      setLoadingtrips(false);
    }
  };
  useEffect(() => {
    loadTrips();
    return () => {
      mounted = false;
    };
  }, []);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    (async () => {
      await loadTrips();
      setRefreshing(false);
    })();
  }, []);

  socket.on("trip:updated:users", (data) => {
    if (data.receivers) {
      if (data.receivers.includes(user._id)) {
        if (mounted) {
          loadTrips();
        }
      }
    }
  });

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
                Ongoing{" "}
                <ActivityIndicator
                  size='small'
                  color={colors.primary}
                  animating={loadingtrips}
                />
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
            <Pressable
              style={[
                styles.selectButton,
                showing === "Cancelled" ? styles.selected : styles.unselected,
              ]}
              onPress={() => setShowing("Cancelled")}>
              <AppText
                style={[
                  showing === "Cancelled"
                    ? styles.selectedText
                    : styles.unselectedText,
                ]}>
                Cancelled
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
              Your {showing} Trips will Appear Here
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

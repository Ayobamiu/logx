/** @format */

import React, { useCallback, useState } from "react";
import FuzzySearch from "fuzzy-search";

import {
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  View,
  Modal,
  FlatList,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AppButton from "../components/AppButton";
import colors from "../config/colors";
import useBanks from "../hooks/useBanks";
import { AntDesign } from "@expo/vector-icons";

import showToast from "../config/showToast";
import AppTextInput from "../components/AppTextInput";
import AppText from "../components/AppText";

function AddBankRecordScreen(props) {
  const {
    banks,
    confirmBank,
    name,
    loading,
    message,
    addBankRecord,
  } = useBanks();
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectABank, setSelectABank] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  useCallback(() => {
    showToast(message);
  }, [message])();

  const BankRecord = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.bankRecord}
        onPress={() => {
          setSelectedBank(item);
          setSelectABank(false);
        }}>
        <AppText>{item.Name}</AppText>
      </TouchableOpacity>
    );
  };

  let banksdata = banks.sort(function (a, b) {
    var textA = a.Name.toUpperCase();
    var textB = b.Name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  if (searchQuery) {
    const searcher = new FuzzySearch(banksdata, ["Name"], {
      caseSensitive: false,
    });
    banksdata = searcher.search(searchQuery);
  }

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView>
        <ActivityIndicator animating={loading} color={colors.primary} />

        <Pressable
          style={[
            styles.row,
            {
              width: "100%",
              height: 50,
              backgroundColor: colors.inputGray,
              marginVertical: 10,
              paddingHorizontal: 16,
              justifyContent: "space-between",
            },
          ]}
          onPress={() => setSelectABank(true)}>
          <AppText
            size='16'
            style={{ color: selectedBank ? colors.black : colors.light }}>
            {selectedBank ? `${selectedBank.Name}` : "Select your bank"}
          </AppText>
          <AntDesign name='caretdown' size={14} color={colors.light} />
        </Pressable>

        <AppTextInput
          placeholder='Account Number'
          keyboardType='numeric'
          returnKeyType='done'
          style={{ paddingHorizontal: 16, marginBottom: 10 }}
          onChangeText={(text) => {
            setAccountNumber(text);
            if (text.length === 10) {
              confirmBank(text, selectedBank && selectedBank.Code);
            }
          }}
        />

        <AppTextInput
          placeholder='Account Name'
          defaultValue={name}
          style={{ paddingHorizontal: 16 }}
        />
      </KeyboardAvoidingView>
      <AppButton
        title={
          uploadVisible ? (
            <ActivityIndicator animating={uploadVisible} />
          ) : (
            "Add Bank Record"
          )
        }
        fullWidth
        style={styles.mtAuto}
        onPress={async () => {
          setUploadVisible(true);

          try {
            await addBankRecord(
              {
                bank: selectedBank,
                accountNumber,
                accountName: name,
                Name: selectedBank.Name,
              },
              (progress) => setProgress(progress)
            );
            setUploadVisible(false);
            showToast("Bank record added!");
            setTimeout(() => {
              props.navigation.navigate("WithdrawalScreen");
            }, 1000);
          } catch (error) {
            if (error) {
              setUploadVisible(false);
              showToast("Could not save bank record");
            }
          }
        }}
      />
      <Modal visible={selectABank} presentationStyle='formSheet'>
        <FlatList
          stickyHeaderIndices={[0]}
          contentContainerStyle={styles.container}
          ListHeaderComponent={
            <View>
              <View style={[styles.row, { justifyContent: "space-between" }]}>
                <AppText
                  style={{
                    color: colors.primary,
                    fontWeight: "bold",
                    marginVertical: 16,
                  }}
                  onPress={() => setSelectABank(false)}>
                  Close
                </AppText>
              </View>
              <AppTextInput
                placeholder='Search'
                onChangeText={(text) => setSearchQuery(text)}
                defaultValue={searchQuery}
              />
            </View>
          }
          data={banksdata}
          keyExtractor={(item) => item.Code}
          renderItem={({ item }) => <BankRecord item={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  button: {
    marginVertical: 4,
  },

  error: {
    color: colors.danger,
  },

  bankRecord: { width: "100%", backgroundColor: colors.white, padding: 16 },
  container: { padding: 16, flex: 1 },
  full_width: { flex: 1, height: "100%" },
  mtAuto: {
    width: "100%",
    alignSelf: "center",
    marginTop: 50,
  },
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
  separator: { height: 2, width: "100%", backgroundColor: colors.greyBg },

  statusContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
export default AddBankRecordScreen;

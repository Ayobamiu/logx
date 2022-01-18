/** @format */

import { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "../api/client";
import storage from "../auth/storage";

const useBanks = () => {
  const [bankRecords, setBankRecords] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);

  const confirmBank = async (account_number, account_bank) => {
    setName("");
    setMessage("");
    setStatus("");
    setLoading(true);
    try {
      const result = await axios.post(
        "https://api.flutterwave.com/v3/accounts/resolve",
        {
          account_number,
          account_bank,
        },
        {
          headers: {
            Authorization: "Bearer FLWSECK-8784009391a9c53cc089aed215c14dea-X",
          },
        }
      );
      setMessage(result.data.message);
      setStatus(result.data.status);
      setName(result.data.data.account_name);
    } catch (error) {
      setError(true);
      if (error.response) {
        // Request made and server responded
        setMessage(error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        setMessage("Could not Fetch Account Details");
      } else {
        // Something happened in setting up the request that triggered an Error
        setMessage(error.message);
      }
    }
    setLoading(false);
  };
  const loadBanks = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        "https://api.ravepay.co/v2/banks/NG?public_key=FLWPUBK_TEST-5120f20f66db336ffc0f6131bcc49936-X"
      );
      setBanks(result.data.data.Banks);
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };
  const getBankRecords = async () => {
    const token = await storage.getToken();
    setLoading(true);
    try {
      const result = await apiClient.get("/withdraw/banks", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setBankRecords(result.data);
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };
  const addBankRecord = async (
    { bank, accountNumber, accountName, bankName },
    onUploadProgress
  ) => {
    const token = await storage.getToken();

    setLoading(true);
    try {
      const result = await apiClient.post(
        "/withdraw/add-bank",
        { bank, accountNumber, accountName, bankName },
        {
          onUploadProgress: (progressEvent) => {
            onUploadProgress(progressEvent.loaded / progressEvent.total);
          },
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setBankRecords([result.data, ...bankRecords]);
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (banks.length === 0) {
      loadBanks();
    }
  }, []);

  return {
    error,
    loading,
    loadBanks,
    banks,
    name,
    status,
    confirmBank,
    message,
    getBankRecords,
    bankRecords,
    addBankRecord,
  };
};
export default useBanks;

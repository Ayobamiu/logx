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
            Authorization:
              "Bearer FLWSECK_TEST-f405da071aca4b9d683201fa235b9b3f-X",
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
  const loadBanks = async (mounted) => {
    if (mounted) {
      setLoading(true);
    }
    try {
      const result = await axios.get(
        "https://api.ravepay.co/v2/banks/NG?public_key=FLWPUBK-cb97fcca397253032055065ae719157c-X"
      );
      if (mounted) {
        setBanks(result.data.data.Banks);
      }
    } catch (error) {
      if (mounted) {
        setError(true);
      }
    }
    if (mounted) {
      setLoading(false);
    }
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
    let mounted = true;
    if (banks.length === 0) {
      loadBanks(mounted);
    }
    return () => {
      mounted = false;
    };
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

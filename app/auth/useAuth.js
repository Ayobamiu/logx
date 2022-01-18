/** @format */

import { useContext, useEffect, useState } from "react";
import authStorage from "./storage";
import jwt_decode from "jwt-decode";
import { clearAll, remove, store, get } from "../utility/cache";
import AuthContext from "../contexts/auth";
import authApi from "../api/auth";

import showToast from "../config/showToast";
import ModeContext from "../contexts/mode";
import OnlineStatusContext from "../contexts/onlineStatus";
// import SelectedStoreContext from "../contexts/selectedStore/context";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);
  const [sendingTripCode, setSendingTripCode] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const { mode, setMode } = useContext(ModeContext);
  const { isOnline, setIsOnline } = useContext(OnlineStatusContext);

  const changeUserOnlineStatus = async (isOnline) => {
    await store("user:onlineStatus", isOnline);
    setIsOnline(isOnline);
  };
  const changeUserMode = async (mode) => {
    await store("user:mode", mode);
    setMode(mode);
  };
  const logIn = (token) => {
    var user = jwt_decode(token);
    setUser(user.user);
    authStorage.storeAuthToken(token);
  };
  const saveUser = (user) => {
    authStorage.storeUser(user);
    setUser(user);
  };
  const saveAndSendCode = async (email) => {
    const code = Math.floor(100000 + Math.random() * 900000);
    //send it
    setSendingCode(true);
    const result = await authApi.verify({ code, email });

    if (result.data && result.data.error) {
      setSendingCode(false);
      return showToast("Error, try again!");
    }
    if (result.error) {
      setSendingCode(false);
      return showToast("Error, try again!");
    }
    setSendingCode(false);

    //store it
    await store("verify:code", code);
    showToast("A verification code has been sent to your phone and email!");

    return code;
  };
  const saveAndSendEndTripCode = async (tripId, packageId) => {
    const code = Math.floor(100000 + Math.random() * 900000);

    setSendingCode(true);
    const result = await authApi.sendEndTripOTP({
      code,
      packageId,
      tripId,
    });

    if (result.data && result.data.error) {
      setSendingCode(false);
      return showToast("Error, try again!");
    }
    if (result.error) {
      setSendingCode(false);
      return showToast("Error, try again!");
    }
    //send it
    setSendingTripCode(true);

    //store it
    await store("trip:code", code);
    showToast("Trip OTP has been sent to receiver's phone and email!");
    setSendingTripCode(false);

    return code;
  };
  const saveAndSendTripCode = async (tripId, email, type) => {
    const code = Math.floor(100000 + Math.random() * 900000);

    setSendingCode(true);
    const result = await authApi.verifyTrip({
      code,
      email,
      type,
      tripId,
    });

    if (result.data && result.data.error) {
      setSendingCode(false);
      return showToast("Error, try again!");
    }
    if (result.error) {
      setSendingCode(false);
      return showToast("Error, try again!");
    }
    //send it
    setSendingTripCode(true);

    //store it
    await store("trip:code", code);
    showToast("Trip OTP has been sent to sender's phone and email!");
    setSendingTripCode(false);

    return code;
  };
  const saveAndSendResetPassworCode = async (email) => {
    const code = Math.floor(100000 + Math.random() * 900000);

    setSendingCode(true);
    const result = await authApi.passordResetCode({
      code,
      email,
    });

    setSendingCode(false);
    if (result.data && result.data.error) {
      return showToast("Error, try again!");
    }
    if (result.error) {
      return showToast("Error, try again!");
    }

    //store it
    await store("password:reset:code", code);
    showToast("Password reset code has been sent to your email!");

    return code;
  };
  const logOut = async () => {
    authStorage.removeToken();
    setTimeout(() => {
      setUser(null);
    }, 200);
  };
  return {
    logIn,
    logOut,
    setUser,
    user,
    saveAndSendCode,
    saveUser,
    sendingCode,
    saveAndSendTripCode,
    sendingTripCode,
    changeUserMode,
    changeUserOnlineStatus,
    saveAndSendEndTripCode,
    saveAndSendResetPassworCode,
  };
};
export default useAuth;

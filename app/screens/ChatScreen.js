/** @format */

import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import ConversationItemLeft from "../components/ConversationItemLeft";
import ConversationItemRight from "../components/ConversationItemRight";
import colors from "../config/colors";
import { Ionicons, Feather } from "@expo/vector-icons";
import socket from "../api/socket";
import AuthContext from "../contexts/auth";
import timeSince from "../utility/timeSince";
import chatAPIs from "../api/chat";
import showToast from "../config/showToast";
import useNotification from "../hooks/useNotification";

function ChatScreen(props) {
  const vi = useRef();
  let mounted = true;
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const params = props.route.params;
  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      title: `#${params.tripId}`,
      headerRight: () => (
        <Ionicons
          color={colors.black}
          name='ellipsis-vertical-sharp'
          size={24}
        />
      ),
    });
  }, [props.navigation]);

  const loadChats = async () => {
    if (mounted) {
      setLoading(true);
    }
    const { data, error } = await chatAPIs.getTripChats(params.tripId);
    if (mounted) {
      setLoading(false);
    }
    if (error) {
      showToast("Error loading chats");
    }
    if (!error && data) {
      if (mounted) {
        setChats(data);
      }
    }
  };
  useEffect(() => {
    socket.emit("request:to:join", params.tripId);
    socket.on("chat", (msg) => {
      if (mounted) {
        setChats((x) => [...x, msg]);
      }
    });
    loadChats();

    return () => {
      mounted = false;
    };
  }, []);

  const { removeAllChatRelated } = useNotification();
  useEffect(() => {
    removeAllChatRelated(params.tripId);
  }, []);

  const [text, setText] = useState("");
  const [chats, setChats] = useState([]);
  const { user } = useContext(AuthContext);
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "height" : ""}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ref={vi}
        onContentSizeChange={() => vi.current.scrollToEnd()}
        onLayout={() => vi.current.scrollToEnd()}>
        <View>
          <AppText style={[styles.light, styles.center, styles.mv10]}>
            This is where you all can collaborate. Any message sent here is
            visible by the delivery personel and receiver
          </AppText>
          {/* <AppText style={[styles.light, styles.center, styles.mv10]}>
            Today
          </AppText> */}
        </View>
        {chats.map((item, index) => (
          <View key={index}>
            {item?.sender?._id === user._id ? (
              <ConversationItemRight
                text={item.text}
                time={`${timeSince(new Date(item.createdAt), true)} ago`}
                name={item.sender?.firstName}
                imageUrl={item.sender?.profilePhoto}
              />
            ) : (
              <ConversationItemLeft
                text={item.text}
                time={`${timeSince(new Date(item.createdAt), true)} ago`}
                name={item.sender?.firstName}
                imageUrl={item.sender?.profilePhoto}
              />
            )}
          </View>
        ))}
      </ScrollView>
      <ActivityIndicator color={colors.primary} animating={loading} />
      <AppTextInput
        rounded
        multiline={true}
        placeholder='Type here...'
        style={[
          styles.ph10,
          focused && Platform.OS === "ios" && { bottom: 50 },
        ]}
        defaultValue={text}
        onChangeText={(txt) => setText(txt)}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        Icon={
          <Pressable
            style={[styles.icon]}
            onPress={() => {
              if (text) {
                socket.emit("chat", {
                  text,
                  sender: { _id: user._id, firstName: user.firstName },
                  createdAt: new Date(),
                  trip: params.tripId,
                });
                (async () => {
                  chatAPIs.addTripChat({
                    text,
                    trip: params.tripId,
                  });
                })();
                setText("");
              }
            }}>
            <Feather name='send' size={24} color={colors.white} />
          </Pressable>
        }
      />
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  bottom: { bottom: 0, position: "absolute" },
  chats: {},
  center: { textAlign: "center" },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
    justifyContent: "space-between",
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 38 / 2,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {},
  light: { color: colors.light, fontWeight: "200" },
  p10: { padding: 10 },
  ph10: { paddingHorizontal: 10, paddingVertical: 5 },
  mh10: { marginHorizontal: 10 },
  mv10: { marginVertical: 10 },
});
export default ChatScreen;

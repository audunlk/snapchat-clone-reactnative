import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { auth, database } from "../config/firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  startAt,
  endAt,
} from "firebase/firestore";
import { arrayUnion } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";

export default function UserChatScreen({ route }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [friend, setFriend] = useState(route.params.friend);
  const [loading, setLoading] = useState(false);
  const [currentUserUsername, setCurrentUserUsername] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          setLoading(true);
          setUser(user);
          console.log(user.uid + "    user id");
          const currentUserUsername = await getDoc(
            doc(database, "users", user.uid)
          );
          setCurrentUserUsername(currentUserUsername.data().username);
          console.log(currentUserUsername.data().username + "    username");
          const userRef = doc(database, "users", user.uid);
          const userDoc = await getDoc(userRef);
          setMessages(userDoc.data().messages || []);
          console.log(userDoc.data().messages);
          setLoading(false);
          setFriend(route.params.friend);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSendMessage = async () => {
    if(newMessage === "") return;
    const userRef = doc(database, "users", user.uid);
    const friendRef = doc(database, "users", friend.id);
    const now = new Date().getTime();
    const readabletime = new Date(now).toLocaleString();
    //id is the id of the conversation partner
    await updateDoc(userRef, {
      messages: arrayUnion({
        id: friend.id,
        sentByUser: currentUserUsername,
        message: newMessage,
        senderId: user.uid,
        timeSent: readabletime,
      }),
    });
    await updateDoc(friendRef, {
      messages: arrayUnion({
        id: user.uid,
        sentByUser: currentUserUsername,
        message: newMessage,
        senderId: user.uid,
        timeSent: readabletime,
      }),
    });

    setNewMessage("");
    //refresh page to show new message
    const userDoc = await getDoc(userRef);
    setMessages(userDoc.data().messages);
    console.log(newMessage);
  };

  return (
    <View style={styles.container}>
      {loading ? <Text>Loading...</Text> : null}
      <Text>{friend.username}</Text>

      <View style={styles.messageContainer}>
        {messages.map((message, index) => {
          if (message.senderId !== friend.id) {
            return (
              <View key={index} style={styles.messages}>
                <Text
                  style={{
                    textAlign: "right",
                    color: "red",
                  }}
                >
                  {currentUserUsername}
                </Text>
                <Text style={{ textAlign: "right" }}>{message.message}</Text>
              </View>
            );
          } else {
            return (
              <View key={index} style={styles.messages}>
                <Text style={{ color: "blue" }}>{friend.username}(me)</Text>

                <Text>{message.message}</Text>
              </View>
            );
          }
        })}
        <View style={styles.input}>
          <TextInput
            value={newMessage}
            onChangeText={(text) => setNewMessage(text)}
            placeholder="Type a message"
          />
          <TouchableOpacity onPress={handleSendMessage}>
            <Text>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  messageContainer: {
    flex: 1,
    marginTop: 20,
    height: 500,
    width: "100%",
    backgroundColor: "white",
    alignItems: "center",
  },
  messages: {
    alignContent: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: "100%",
    padding: 10,
  },
  input: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 40,
    marginBottom: 120,
    borderTopWidth: 1,
    borderTopColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
});

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { auth, database } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { arrayUnion } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function UserChatScreen({ route }) {
  const scrollViewRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [friend, setFriend] = useState(route.params.friend);
  const [loading, setLoading] = useState(false);
  const [currentUserUsername, setCurrentUserUsername] = useState("");
  const [chatContent, setChatContent] = useState([]);
  const [isVisible, setisVisible] = useState(false);
  const [newMessageIncoming, setNewMessageIncoming] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (!user || !route.params.friend) return;
        if (user) {
          setLoading(true);
          setUser(user);
          // console.log(user.uid + "    user id");
          const currentUserUsername = await getDoc(
            doc(database, "users", user.uid)
          );
          console.log(user.uid + "    user id");
          const { username } = currentUserUsername.data();
          setCurrentUserUsername(username);
          console.log(currentUserUsername + "    username");
          const userRef = doc(database, "users", user.uid);
          const getDocUser = await getDoc(userRef);

          

          const userData = getDocUser.data();
          const userMessages = userData.messages || [];
          const userImages = userData.images || [];
          const totalSort = [...userMessages, ...userImages].sort(
            (a, b) => a.timestamp - b.timestamp
          );
          setChatContent(
            totalSort &&
              totalSort.map((item, i) => {
                if (!totalSort) return;
                //message display
                if (item.message) {
                  if (item.sentByUser === currentUserUsername.data().username) {
                    return (
                      <View
                        key={i}
                        style={[styles.messages, { alignItems: "flex-end", marginRight: 10, }]}
                      >
                        <Text style={{ color: "#08A8F4", fontWeight: "bold" }}>
                          {username}
                        </Text>
                        <Text>{item.message}</Text>
                      </View>
                    );
                  } else {
                    return (
                      <View
                        key={i}
                        style={[styles.messages, { alignItems: "flex-start", marginLeft: 10, }]}
                      >
                        <Text style={{ color: "#F93759", fontWeight: "bold" }}>
                          {item.sentByUser}
                        </Text>
                        <Text>{item.message}</Text>
                      </View>
                    );
                  }
                }
                //image display
                if (item.opened === false) {
                  const imageUrl = item.imageUrl;
                  return (
                    <View
                      key={i}
                      style={[styles.messages, { alignItems: "flex-end" }]}
                    >
                      {!isVisible ? (
                        <Ionicons
                          name="image"
                          size={24}
                          color="black"
                          onPress={handleImageVisibility}
                        />
                      ) : (
                        <Modal visible={isVisible}>
                          <Image
                            source={{ uri: imageUrl }}
                            style={{ width: "100%", height: "100%" }}
                          />
                          <Ionicons
                            name="close"
                            size={24}
                            color="black"
                            onPress={handleImageVisibility}
                            style={{
                              position: "absolute",
                              top: 60,
                              right: 20,
                            }}
                          />
                        </Modal>
                      )}
                    </View>
                  );
                }
                if (item.imageUrl && item.opened === true) {
                  if (item.sentByUser === currentUserUsername.data().username) {
                    return (
                      <View key={i} style={{ alignItems: "flex-end", marginRight: 10, }}>
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={{ width: 200, height: 200 }}
                          onLoad={() => console.log("loaded")}
                        />
                      </View>
                    );
                  } else {
                    return (
                      <View key={i} style={{ alignItems: "flex-start" }}>
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={{ width: 200, height: 200 }}
                          onLoad={() => console.log("loaded")}
                        />
                      </View>
                    );
                  }
                }
                return;
              })
          );
          setLoading(false);
        setNewMessageIncoming(false);
        } else {
          setUser(null);
        }
        
      } catch (error) {
        console.log(error);
      }
    });
    return () => unsubscribe();
  }, [isVisible, newMessageIncoming]);


 

  const handleImageVisibility = () => {
    setisVisible(!isVisible);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
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
        timestamp: now,
      }),
    });
    await updateDoc(friendRef, {
      messages: arrayUnion({
        id: user.uid,
        sentByUser: currentUserUsername,
        message: newMessage,
        senderId: user.uid,
        timeSent: readabletime,
        timestamp: now,
      }),
    });
    setNewMessage("");
    //refresh page to show new message
    const userDoc = await getDoc(userRef);
    setMessages(await userDoc.data().messages);
    setNewMessageIncoming(true);
  };

  return (
    <View style={{ 
      flex: 1, 
      bottom: 100,
      backgroundColor: "#fff",
      }}>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}
        contentContainerStyle={
          {
            flexGrow: 1,
            justifyContent: 'flex-end',
          }
        }
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
      >
        {chatContent}
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
          placeholder="Type a message"
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSendMessage}
        style={{
          height: 50,
          width: 50,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}

        >
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
            </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Avenir",
    position: "absolute",
    bottom: 200,
    paddingVertical: 20,
  },
  messageContainer: {
    flex: 100,
    width: "100%", 
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-end",

  },
  messages: {
    paddingTop: 20,
    paddingBottom: 60,
    
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  input: {
    borderRadius: 20,
    backgroundColor: "lightgrey",
    padding: 10,
    width: "80%",
  },

});


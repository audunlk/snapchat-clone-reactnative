import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { auth, database } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { arrayUnion } from "firebase/firestore";
import { useWindowDimensions } from "react-native";
import { getStorage, ref, listAll } from "firebase/storage";

export default function UserChatScreen({ route }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [friend, setFriend] = useState(route.params.friend);
  const [loading, setLoading] = useState(false);
  const [currentUserUsername, setCurrentUserUsername] = useState("");
  const [images, setImages] = useState([]);
  const [chatContent, setChatContent] = useState([]);
  

  useEffect(() => {
    const storage = getStorage();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if(!user || !route.params.friend ) return;
        if (user) {
          setLoading(true);
          setUser(user);
          // console.log(user.uid + "    user id");
          const currentUserUsername = await getDoc(
            doc(database, "users", user.uid)
          );
          const { username } = currentUserUsername.data();
          setCurrentUserUsername(username);
          console.log(currentUserUsername + "    username")
                 
          
          const userRef = doc(database, "users", user.uid);
          const getDocUser = await getDoc(userRef)
          
          const userData =  getDocUser.data();
          const userMessages = userData.messages || [];
          const userImages = userData.images || [];
          const totalSort = [...userMessages, ...userImages].sort((a, b) => a.timestamp - b.timestamp);
          console.log(totalSort + "    total sort");
          setChatContent(totalSort && totalSort.map((item, i)=> {
            if(!totalSort) return;
            if(item.message) {
              if(item.sentByUser === currentUserUsername.data().username) {
              return (<View 
              key={i}
              style={{alignSelf: "flex-end"}}
              >
              <Text>{username}</Text>
              <Text>{item.message}</Text>
              </View>)
              } else {
                return (<View 
                key={i}
                style={{alignSelf: "flex-start"}}
                >
                <Text>{item.sentByUser}</Text>
                <Text>{item.message}</Text>
                </View>)
              }
            } 
            
            if (item.imageUrl){
              if(item.sentByUser === currentUserUsername.data().username) {
                return (<View
                key={i}
                style={{alignSelf: "flex-end"}}
                >
                <Image
                source={{uri: item.imageUrl}}
                style={{ width: 200, height: 200 }}
                onLoad={() => console.log("loaded")}
              />
                </View>)
              } else {
                return (<View
                key={i}
                style={{alignSelf: "flex-start"}}
                >
                <Image
                source={{uri: item.imageUrl}}
                style={{ width: 200, height: 200 }}
                onLoad={() => console.log("loaded")}
              />
                </View>)
              }
            }
            return;
          }));
          console.log(chatContent + "    chat content");
          setLoading(false);
          setMessages(userMessages);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log(error);
      }
    });
    return unsubscribe;
  }, []);

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
    setMessages(userDoc.data().messages);
  };

  const { height } = useWindowDimensions();
  const navigationFooterHeight = 100;
  const messageContainerMaxHeight = height - navigationFooterHeight;

  const messageContainerPaddingBottom = navigationFooterHeight - 20;

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        
        <View
          style={[
            styles.messageContainer,
            {
              maxHeight: messageContainerMaxHeight,
              paddingBottom: messageContainerPaddingBottom,
            },
          ]}
        >
          {loading ? <Text>Loading...</Text> : chatContent}
          
          
          
          <View style={styles.inputContainer}>
            <TextInput
              value={newMessage}
              onChangeText={(text) => setNewMessage(text)}
              placeholder="Type a message"
              style={styles.input}
            />
            <TouchableOpacity onPress={handleSendMessage}>
              <Text>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Avenir",
  },
  messageContainer: {
    width: "100%",
    backgroundColor: "white",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  messages: {
    alignContent: "flex-end",
    borderTopWidth: 0.5,
    borderTopColor: "lightgrey",
    width: "100%",
    padding: 20,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
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
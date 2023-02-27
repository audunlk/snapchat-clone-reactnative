import React, { useState, useEffect } from 'react';
import { database, auth, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { View, Text, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import {  collection, getDocs } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

export default function SendImage({ route }) {
  const [image, setImage] = useState(route.params.image);
  const [friendList, setFriendList] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          setUser(user);
          const usersRef = collection(database, 'users');
          const usersSnapshot = await getDocs(usersRef);
          const users = usersSnapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
          });
          const friends = await getDoc(doc(database, "users", user.uid));
          setFriendList(friends.data().friends || []);
          setUsers(users);
          setImage(route.params.image);
          console.log(image + "       image")
          setLoading(false);
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    });

    return unsubscribe;
  }, []);

  const handleSelectedFriend = (id) => {
    if (selectedFriend === id) {
      setSelectedFriend('');
    } else {
      setSelectedFriend(id);
    }
  };

  const handleSendImageToUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(image);
      const blob = await response.blob();
      const unixTimeStap = Date.now();
      const imageRef = ref(storage, `${selectedFriend}/${unixTimeStap}.jpeg`);
      await uploadBytes(imageRef, blob, {
        contentType: 'image/jpeg',
      });
      const imageUrl = await getDownloadURL(imageRef);
      const userRef = doc(database, "users", selectedFriend);
      await updateDoc(userRef, {
        images: arrayUnion({
          imageUrl: imageUrl,
          timestamp: unixTimeStap,
          senderId: user.uid,
          opened: false,
        }),
      });
      //upload to user's own images aswell

      //PROBLEM IS IMG SIZE IS TOO BIG
      //NOT WORKING REMOVE CODE IF NOT WORKING
      const userRef2 = doc(database, "users", user.uid);
      await updateDoc(userRef2, {
        images: arrayUnion({
          imageUrl: imageUrl,
          timestamp: unixTimeStap,
          senderId: user.uid,
          opened: false,
        }),
      });
            //NOT WORKING REMOVE CODE IF NOT WORKING
      console.log('Image sent to user');
      setLoading(false);
    } catch (error) {
      console.log("crashed");
    }
    
  };



  return (
    <View style={styles.container}>
      {friendList.map((friend, index) => (
        <TouchableOpacity
          key={index}
          style={styles.friendBar}
          onPress={() => handleSelectedFriend(friend.id)}
          activeOpacity={1}
        >
          <Text>{friend.username}</Text>
          {selectedFriend === friend.id ?
            <Ionicons name="checkmark-circle" size={24} color="black" />
            :
            <Ionicons name="ellipse-outline" size={24} color="black" />}
        </TouchableOpacity>

      ))}
      {selectedFriend ?
        <TouchableOpacity
          style={styles.sendIcon}
          disabled={loading}
          onPress={handleSendImageToUser}
        >
          {loading ? <ActivityIndicator color="white" /> : <Ionicons name="send-outline" size={24} color="white" />}
        </TouchableOpacity>
        :
        null
      }
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'red',
        marginTop: 40
      },
      friendBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        padding: 15,
        marginTop: 20,
        left: 40,
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
      },
      sendIcon: {
        position: "absolute",
        bottom: 60,
        right: 8,
        padding: 12,
        justifyContent: "space-between",
        flexDirection: "row",
        borderRadius: 100,
        backgroundColor: "rgba(0,0,0,0.5)",
      }
    })

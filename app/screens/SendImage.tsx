import React, { useState, useEffect } from 'react';
import { database, auth, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { View, Text, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { arrayRemove, collection, getDocs } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import AppIcon from '../components/AppIcon';
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

export default function SendImage({ route }) {
  const [image, setImage] = useState(null);
  const [friendList, setFriendList] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          setLoading(true);
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
          setLoading(false);
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

  const handleSelectedFriend = (id) => {
    if (selectedFriend === id) {
      setSelectedFriend('');
    } else {
      setSelectedFriend(id);
    }
  };

  const handleSendImageToUser = async () => {
    setLoading(true);
    try {
      // Upload the image to Firebase Storage
      const imageRef = ref(storage, `${user.uid}/${Date.now()}.jpg`);
      await uploadBytes(imageRef, image);
      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(imageRef);
      // Add the image URL to the user's images array in Firestore
      const userRef = doc(database, "users", selectedFriend);
      await updateDoc(userRef, {
        images: arrayUnion(imageUrl)
      });
      console.log('Image sent to user');
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
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

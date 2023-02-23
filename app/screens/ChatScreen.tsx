import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import NavFooter from '../components/NavFooter'
import { auth, database, storage } from '../config/firebase';
import { collection, getDocs, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { StackActions } from '@react-navigation/native';


//Recieve this:
// const handleSendImageToUser = async () => {
//   setLoading(true);
//   try {
//     // Upload the image to Firebase Storage
//     const imageRef = ref(storage, `${user.uid}/${Date.now()}.jpg`);
//     await uploadBytes(imageRef, image);
//     // Get the download URL of the uploaded image
//     const imageUrl = await getDownloadURL(imageRef);
//     // Add the image URL to the user's images array in Firestore
//     const userRef = doc(database, "users", selectedFriend);
//     await updateDoc(userRef, {
//       images: arrayUnion(imageUrl)
//     });
//     console.log('Image sent to user');
//   } catch (error) {
//     console.log(error);
//   }
//   setLoading(false);
// };

export default function ChatScreen( { navigation } ) {
  const [friendList, setFriendList] = useState([]);
  const [onClickUser, setOnClickUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [friendReqPending, setFriendReqPending] = useState([]);

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
          const pendingFriends = await getDoc(doc(database, "users", user.uid));
          setFriendReqPending(pendingFriends.data().pendingFriends || []);
          setFriendList(friends.data().friends || []);
          setUsers(users);
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

  const handleSelectedFriend = (screenName : string, friend) => {
    setSelectedFriend(friend.id);
    console.log(friend.id)
    navigation.dispatch(
      StackActions.replace(screenName, {friend})
    )
  }

  const handleAddFriend = async (friendId) => {
    try {
      const userRef = doc(database, "users", user.uid);
      await updateDoc(userRef, {
        friends: arrayUnion(friendId)
      });
      const friendRef = doc(database, "users", friendId);
      await updateDoc(friendRef, {
        friends: arrayUnion(user.uid)
      });
      const pendingFriendRef = doc(database, "users", user.uid);
      await updateDoc(pendingFriendRef, {
        pendingFriends: arrayUnion(friendId)
      });
      console.log('Friend added');
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <View style={styles.container}>
      {friendReqPending.map((friend, index) => (
        <TouchableOpacity
          key={index}
          style={styles.friendBar}
          onPress={() => handleAddFriend(friend.id)}
          activeOpacity={1}
        >
          <Text>{friend.username}</Text>
          <Ionicons 
          name="person-add-outline"
          size={24} color="black" />
        </TouchableOpacity>
      ))}

      {friendList.map((friend, index) => (
        <TouchableOpacity
          key={index}
          style={styles.friendBar}
          onPress={() => handleSelectedFriend("UserChat", friend)}
          activeOpacity={1}
        >
          <Text>{friend.username}</Text>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
        </TouchableOpacity>
      ))}
      {}
      
    </View>
  )
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

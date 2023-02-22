import React, {useState, useEffect} from 'react'
import {database, auth, } from '../config/firebase'
import {View, Text, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, StyleSheet} from 'react-native'
import { arrayRemove, collection, getDocs } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc, arrayUnion, getDoc} from "firebase/firestore";



export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchForUser, setSearchForUser] = useState<string>('');
  const [friendList, setFriendList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

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

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        user =>
          user.username
            .toLowerCase()
            .includes(searchForUser.toLowerCase()) &&
          user.id !== auth.currentUser.uid &&
          !friendList.some(friend => friend.id === user.id)
      )
    );
  }, [searchForUser, users, friendList]);

  const handleAddFriend = async (id, username) => {
    const userRef = doc(database, "users", user.uid);
    await updateDoc(userRef, {
      friends: arrayUnion({ id, username })
    });
    setFriendList(prevFriends => [...prevFriends, { id, username }]);
    setFilteredUsers(prevUsers => prevUsers.filter(user => user.id !== id));
  };

  const handleRemoveFriend = async (id) => {
    const userRef = doc(database, "users", user.uid);
    await updateDoc(userRef, {
      // find object with id and remove it
      friends: arrayRemove(friendList.find(friend => friend.id === id))
    });
    setFriendList(prevFriends =>
      prevFriends.filter(friend => friend.id !== id)
    );

  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={'handled'}>
    <View style={styles.container}>
      <TouchableOpacity>
        <View style={styles.header}>
          <TextInput
            placeholder="Search"
            onChangeText={(text) => setSearchForUser(text)}
            value={searchForUser}
            autoCorrect={false}
            autoCapitalize="none"
            autoFocus={true}
          />
          <Ionicons name="search" size={24} color="black" />
        </View>
        <View>
          {friendList.map((friend, i) => {
            return (
              <View key={i + 11} style={styles.friendBar}>
                <Text>{friend.username}</Text>
                <TouchableOpacity onPress={() => handleRemoveFriend(friend.id)}>
                <Ionicons name="trash-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>
            );
             } )}
          {filteredUsers.map((user) => (
            <View key={user.id} style={styles.friendBar}>
              <Text>{user.username}</Text>
              <TouchableOpacity onPress={() => handleAddFriend(user.id, user.username)}>
                {loading ? <ActivityIndicator size="small" color="#0000ff" /> : null}
                <Ionicons name="person-add" size={24} color="black"  />
              </TouchableOpacity>
              </View>
          ))}
        </View>
      </TouchableOpacity>
    </View> 
    </ScrollView>
    
  )
}



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    padding: 15,
    marginTop: 60,
    marginBottom: 20,
    left: 40,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
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
  

});

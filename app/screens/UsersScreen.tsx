import React from 'react'
import {database, auth} from '../config/firebase'
import {View, Text, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, StyleSheet} from 'react-native'
import { collection, getDocs } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';


export default function UsersScreen() {
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [user, setUser] = React.useState(null)
  const [searchForUser, setSearchForUser] = React.useState<string>('')

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          setUser(user)
          const usersRef = collection(database, 'users')
          const usersSnapshot = await getDocs(usersRef)
          const users = usersSnapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() }
          })
          setUsers(users)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.log(error)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const filteredUsers = users.filter(user => {
    const searchTerm = searchForUser.toLowerCase()
    const name = user.username.toLowerCase()
    return name.includes(searchTerm) && user.uid !== auth.currentUser.uid
  })

  const handleAddFriend = (userId) => {
    console.log(`Add friend button clicked for user ${userId}`)
  }

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
            {filteredUsers.map((user) => (
              <View key={user.id} style={styles.friendBar}>
                <Text>{user.username}</Text>
                <TouchableOpacity onPress={() => handleAddFriend(user.id)}>
                  <Ionicons name="person-add" size={24} color="grey" />
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

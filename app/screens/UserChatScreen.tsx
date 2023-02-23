import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { auth, database,  } from '../config/firebase';
import { doc, getDoc, getDocs, collection, query, where, orderBy, limit, startAfter, endBefore, startAt, endAt } from "firebase/firestore";
import { arrayUnion } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";

export default function UserChatScreen({route}) {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [user, setUser] = useState(null)
    const [friend, setFriend] = useState(route.params.friend)
    const [loading, setLoading] = useState(true)
    const [currentUserUsername, setCurrentUserUsername] = useState('')
    

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            try {
                if (user) {
                    setLoading(true);
                    setUser(user);
                    console.log(user.uid)
                    const currentUserUsername = await getDoc(doc(database, "users", user.uid));
                    setCurrentUserUsername(currentUserUsername.data().username)
                    console.log(currentUserUsername.data().username)
                    const userRef = doc(database, "users", user.uid);
                    const userDoc = await getDoc(userRef);
                    setMessages(userDoc.data().messages || []);
                    console.log(userDoc.data().messages)
                    setLoading(false);
                    setFriend(route.params.friend)
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
        const userRef = doc(database, "users", user.uid);
        const friendRef = doc(database, "users", friend.id);
        
        await updateDoc(userRef, {
            messages: arrayUnion({ id: friend.id, sentByUser: currentUserUsername, message: newMessage, senderId: user.uid })
        });
        await updateDoc(friendRef, {
            messages: arrayUnion({ id: user.uid, sentByUser: currentUserUsername, message: newMessage, senderId: user.uid })
        });
        
        setNewMessage('')
        //refresh page to show new message
        const userDoc = await getDoc(userRef);
        setMessages(userDoc.data().messages);
        console.log(newMessage)
    }

  return (
    <View style={styles.container}>
                <Text>{friend.username}</Text>

        <View style={styles.messageContainer}>
            {messages.map((message, index) => {
                if (message.id === friend.id) {
                    return (
                        <View key={index}>
                            <Text> {currentUserUsername}(me)</Text>
                            <Text>{message.message}</Text>
                        </View>
                    )
                }else {
                    return (
                        <View key={index}>
                            <Text>{friend.username}</Text>
                            <Text>{message.message}</Text>
                        </View>
                    )
                }
            })}
            <TextInput
                value={newMessage}
                onChangeText={
                    (text) => setNewMessage(text)
                }
                placeholder="Type a message"
            />
            <TouchableOpacity onPress={handleSendMessage}>
                <Text>Send</Text>
            </TouchableOpacity>
            
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    messageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

})


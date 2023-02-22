import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, StatusBar, Alert, ScrollView } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";

export default function Register({ navigation }) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [uniqueUsername, setUniqueUsername] = useState<string>('');

    const onHandleRegister = async () => {
        if(email !== '' && password !== '' && uniqueUsername !== '') {
            // Check if username is already taken
            const usernameDoc = doc(database, 'usernames', uniqueUsername);
            const docSnapshot = await getDoc(usernameDoc);
            if (docSnapshot.exists()) {
                Alert.alert('Error', 'This username is already taken. Please choose a different username.');
                return;
            }

            // Create new user in auth and Firestore
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    const { uid } = userCredential.user;
                    const userDoc = doc(database, 'users', uid);
                    const userData = {
                        email,
                        username: uniqueUsername,
                    };
                    await setDoc(userDoc, userData);
                    await setDoc(usernameDoc, { userId: uid });
                    Alert.alert('Success', 'Account created successfully');
                    navigation.navigate('Map');
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    Alert.alert('Error', errorMessage);
                });
        } else {
            Alert.alert('Error', 'Please fill in all fields');
        }
    };

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"handled"}>
            <View>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView>
                    <View style={styles.container}>
                        <Text style={styles.title}>Sign Up</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Email"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            autoFocus={true}
                            textContentType="emailAddress"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Password"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={true}
                            textContentType="password"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Username"
                            value={uniqueUsername}
                            onChangeText={(text) => setUniqueUsername(text)}
                            textContentType="username"
                        />
                        <TouchableOpacity style={styles.button} onPress={onHandleRegister}>
                            <Text style={styles.buttonText}>Sign up</Text>
                        </TouchableOpacity>
                    
                        <Text style={{color: "grey"}}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text>Log In!</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        width: "80%",
        height: "100%",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 30,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        width: '100%',
        height: 40,
        backgroundColor: '#333',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,

    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    }
});

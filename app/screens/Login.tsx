import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button, SafeAreaView, TouchableOpacity, StatusBar, Alert, ScrollView } from "react-native";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, database } from "../config/firebase";

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // log out user if they are already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        signOut(auth);
      }
    });
    return unsubscribe;
  }, []);

  const onHandleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"handled"}>
      <View>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
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
            
            <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Text style={{ color: "grey" }}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text>Sign up!</Text>
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

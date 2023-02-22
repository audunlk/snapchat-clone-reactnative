import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, SafeAreaView, TouchableOpacity, StatusBar, Alert, ScrollView } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export default function Login({ navigation }) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const onHandleLogin = () => {
        if(email !== '' && password !== '') {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorMessage = error.message;
                Alert.alert('Error', errorMessage);

            })
        } else {
            Alert.alert('Error', 'Please fill in all fields');
        }
    };

    return(
        <View>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <ScrollView keyboardShouldPersistTaps={"handled"}>
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
                    
                        <Text style={{color: "grey"}}>Dont have an account?</Text>
                        <TouchableOpacity  onPress={() => navigation.navigate('Register')}>
                             <Text>Sign up!</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        width: '100%',
        height: 40,
        backgroundColor: '#333',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    }
});


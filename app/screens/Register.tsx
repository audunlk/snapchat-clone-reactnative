import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, SafeAreaView, TouchableOpacity, StatusBar, Alert, ScrollView } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export default function Register({ navigation }) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const onHandleRegister = () => {
        if(email !== '' && password !== '') {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() =>{
                Alert.alert('Success', 'Account created successfully');
                navigation.navigate('Login');
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
                <ScrollView>
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
                        <TouchableOpacity style={styles.button} onPress={onHandleRegister}>
                            <Text style={styles.buttonText}>Sign up</Text>
                        </TouchableOpacity>
                    
                        <Text style={{color: "grey"}}>Already have an account?</Text>
                        <TouchableOpacity  onPress={() => navigation.navigate('Login')}>
                             <Text>Log In!</Text>
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


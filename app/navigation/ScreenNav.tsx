import React, { useState, useContext, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebase";
import MapScreen from '../screens/MapScreen';
import ChatScreen from '../screens/ChatScreen';
import CameraScreen from '../screens/CameraScreen';
import UsersScreen from '../screens/UsersScreen';
import SendToScreen from "../screens/SendToScreen";
import Login from '../screens/Login';
import Register from '../screens/Register';
import BottomNav from "./BottomNav";
import { ActivityIndicator, View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";


type AuthenticatedUserContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthenticatedUserContext = React.createContext<AuthenticatedUserContextType>({
    user: null,
    setUser: () => {},
});

function AuthenticatedUserProvider({ children }) {
    const [user, setUser] = useState<User | null>(null);
    return (
        <AuthenticatedUserContext.Provider value={{ user, setUser }}>
          {children}
        </AuthenticatedUserContext.Provider>
      );
}

const Stack = createStackNavigator();

function AuthStack(){
    return(
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
      </Stack.Navigator>
    )
}

function AuthAccessStack(){
    return (
      <Stack.Navigator>
        <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Users" component={UsersScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SendTo" component={SendToScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    ); 
  }


function RootNavigator() {
    const {user, setUser} = useContext(AuthenticatedUserContext)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try{
                user ? setUser(user) : setUser(null);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        });
        return unsubscribe;
    }, [user]);

    if (loading) {
        return(
          <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }
      return (
        <>
            {user ? <AuthAccessStack /> : <AuthStack />}
        </>
      );
    }
    
export default function ScreenNav() {
    return(
        <AuthenticatedUserProvider>
            <RootNavigator />
        </AuthenticatedUserProvider>
    )

}

const styles = StyleSheet.create({
    nav: {
        backgroundColor: "black",
        height: 100,
        paddingBottom: 30,
    },
})


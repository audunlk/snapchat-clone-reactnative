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
import Login from '../screens/Login';
import Register from '../screens/Register';
import { ActivityIndicator, View } from "react-native";


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

function AuthStack(){
    const Tab = createBottomTabNavigator();
    return(
        <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen name="Login" component={Login} />
            <Tab.Screen name="Register" component={Register} />
        </Tab.Navigator>
    )
}


    

function AuthAccessStack(){
    const Tab = createBottomTabNavigator();
    const Icons = {
      Map: "md-location-outline",
      Chat: "ios-chatbox-outline",
      Camera: "camera-outline", 
      Users: "ios-people-outline",
    }
    return (
      <Tab.Navigator
        screenOptions={(route) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = Icons[route.route.name];
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveBackgroundColor: "black",
          tabBarInactiveBackgroundColor: "black",
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "grey",
          tabBarStyle: styles.nav,
          headerShown: false,
          tabBarAllowFontScaling: true,
          tabBarLabelStyle: {
            fontSize: 10,
          },
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="Users" component={UsersScreen} />
        
      </Tab.Navigator>
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

    
export default function BottomNav() {
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


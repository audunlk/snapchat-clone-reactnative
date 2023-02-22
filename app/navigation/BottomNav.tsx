import React from 'react';
import MapScreen from '../screens/MapScreen';
import ChatScreen from '../screens/ChatScreen';
import CameraScreen from '../screens/CameraScreen';
import UsersScreen from '../screens/UsersScreen';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';


const Tab = createBottomTabNavigator();


export default function BottomNav() {

    const Icons = {
        Map: "md-location-outline",
        Chat: "ios-chatbox-outline",
        Camera: "camera-outline", 
        Users: "ios-people-outline",
    }

  return (
    <Tab.Navigator screenOptions={(route) =>{
        
        return({
            tabBarIcon: ({focused, color, size}) => {
                const iconName = Icons[route.route.name];
                return <Ionicons name={iconName} size={size} color={color} />
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
            
        })
    }} >
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="Users" component={UsersScreen} />
    </Tab.Navigator>

  )
}

const styles = StyleSheet.create({
    nav: {
        backgroundColor: "black",
        height: 100,
        paddingBottom: 30,
    },
})


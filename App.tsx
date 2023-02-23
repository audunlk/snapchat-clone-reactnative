import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ScreenNav from './app/navigation/ScreenNav';
import { createStackNavigator } from '@react-navigation/stack';
import NavFooter from './app/components/NavFooter';


const Stack = createStackNavigator();
export default function App() {

  return (
    <NavigationContainer>
      <ScreenNav />
      <StatusBar style="auto" />
  </NavigationContainer>
  );
}



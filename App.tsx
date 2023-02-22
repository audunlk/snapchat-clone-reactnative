import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomNav from './app/navigation/BottomNav';
import SendToScreen from './app/screens/SendToScreen';
import ScreenNav from './app/navigation/ScreenNav';
import { createStackNavigator } from '@react-navigation/stack';
import NavFooter from './app/components/NavFooter';


const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <ScreenNav />
      <NavFooter />
  </NavigationContainer>
  );
}



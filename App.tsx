import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import CameraScreen from './app/screens/CameraScreen';
import BottomNav from './app/navigation/BottomNav';

export default function App() {
  return (
    <NavigationContainer>
      <BottomNav />
      <StatusBar style="auto" />
        
    </NavigationContainer>
  );
}



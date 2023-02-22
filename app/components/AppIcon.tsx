import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { AntDesign, Ionicons} from '@expo/vector-icons';


export default function AppIcon({ AntName, IonName, style, color, size, onPress}) {
  return (
    <TouchableOpacity style={[style.icon, {...styles}]} onPress={onPress}>
        {AntName && <AntDesign name={AntName} size={size} color={color} style={style} />}
        {IonName && <Ionicons name={IonName} size={size} color={color} style={style} />}
    </TouchableOpacity>

  )
}

const styles = StyleSheet.create({
    icon: {
        height: 60,
        width: 60,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    }
    });


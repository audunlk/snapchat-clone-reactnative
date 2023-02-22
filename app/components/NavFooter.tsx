import { Ionicons } from '@expo/vector-icons'
import React, {useState} from 'react'
import { View, Text,StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native';

export default function NavFooter() {
  const navigation = useNavigation()
  const [cameraPageFlag, setCameraPageFlag] = useState(false)

  const handleOnClickNav = (screenName: string) => {
    navigation.navigate(screenName as never)
    if (screenName === 'Camera') {
      navigation.navigate('Camera' as never)
      setCameraPageFlag(true)
    } else {
      setCameraPageFlag(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.fixedFooter}>
        <Ionicons
          name="md-location-outline"
          size={24}
          color={cameraPageFlag ? 'white' : 'black'}
          onPress={(event: any) => handleOnClickNav('Map')}
        />
        <Ionicons
          name="ios-chatbox-outline"
          size={24}
          color={cameraPageFlag ? 'white' : 'black'}
          onPress={(event: any) => handleOnClickNav('Chat')}
        />
        <Ionicons
          name="camera-outline"
          size={24}
          color={cameraPageFlag ? 'white' : 'black'}
          onPress={(event: any) => handleOnClickNav('Camera')}
        />
        <Ionicons
          name="ios-people-outline"
          size={24}
          color={cameraPageFlag ? 'white' : 'black'}
          onPress={(event: any) => handleOnClickNav('Users')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    fixedFooter: {
        position: "absolute",
        justifyContent: "space-around",
        width: "100%",
        flexDirection: "row",
        padding: 20,
        bottom: 0,
        height: 100,
        
    },
})



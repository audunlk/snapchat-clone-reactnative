import React, {useState, useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, Image, Modal, Button } from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { Text, View } from "react-native";
import AppIcon from "../components/AppIcon";
import { auth, database } from "../config/firebase";
import { signOut } from "firebase/auth";
import SendImage from "./SendImage";
import { useNavigation, StackActions } from "@react-navigation/native";

export default function CameraScreen({navigation}) {

  const [allowedCamera, setAllowedCamera] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  
  
  if(!allowedCamera) {
    try{
      (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setAllowedCamera(status === "granted");
    })();
  } catch (error) {
    console.log("error loading camera");
  }
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  function toggleFlashMode() {
    setFlashMode(current => (current === FlashMode.off ? FlashMode.on : FlashMode.off));
  }

  const toggleLogOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => {
        alert(error.message);
        console.log(error);
      });
  }

  
  const camRef = useRef<Camera>(null);

  const takePicture = async () => {
    if(camRef) {
      try{
        const data = await camRef.current?.takePictureAsync();
      setImagePreview(data?.uri);
      setIsOpen(true);
      console.log("picture taken")
      } catch (error) {
        console.log("error taking picture");
      }
    }
    return;
  }

  const removePreview = () => {
    setImagePreview(null);
  }

   
  const handleSendImage = (screenName: string) => {
    try{
      console.log(imagePreview + "       image in CameraScreen")
    navigation.dispatch(StackActions.replace(screenName, {image: imagePreview}));
      console.log("image sent")
    } catch (error) {
      console.log("error sending image");
    }
  }
     

  if(imagePreview) {
    return(
      <Modal visible={isOpen} animationType="none">
        <Image source={{uri: imagePreview}} style={{width: "100%", height: "100%"}} />
        <View style={styles.sendIcon}>
          <AppIcon AntName="" IonName="send-outline" color="#eee" size={24} style={{}} onPress={(event: any) => handleSendImage('SendImage')} />
        </View>
        <View style={styles.deleteIcon}>
          <AppIcon AntName="" IonName="close" color="#eee" size={24} style={{}} onPress={removePreview} />
        </View> 
      </Modal>
    )
  }
  return (
    <View style={styles.container}>
      <Camera 
      style={styles.camera} 
      type={type} 
      flashMode={flashMode}
      ref={camRef}
      >
        <TouchableOpacity style={styles.captureBtn} onPress={takePicture}></TouchableOpacity>
        <View style={styles.header}>
          <AppIcon AntName="" IonName="person" color="#eee" size={24} style={{}} onPress={() => {}} />
          <AppIcon AntName="" IonName="camera-reverse-outline" color="#eee" size={24} style={{}} onPress={toggleCameraType} />
        </View>
        <View style={styles.sideItems}>
          <AppIcon style={styles.sideIcon} AntName="" IonName="settings-outline" color="#eee" size={24}  onPress={() => {}} />
          <AppIcon style={styles.sideIcon} AntName="" IonName="flash-outline" color={flashMode === FlashMode.off ? "white" : "yellow"}size={24} onPress={toggleFlashMode} />
          <AppIcon style={styles.sideIcon} AntName="" IonName="ios-musical-notes-outline" color="#eee" size={24} onPress={() => {}} />
          <AppIcon style={styles.sideIcon} AntName="" IonName="log-out-outline" color="#eee" size={24} onPress={toggleLogOut} />
        </View>
      </Camera>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  captureBtn: {
    position: "absolute",
    bottom: 100,
    width: 60,
    height: 60,
    borderRadius: 100,
    borderColor: "white",
    borderWidth: 3,
    alignSelf: "center",
  },
  header: {
    position: "absolute",
    top: 60,
    justifyContent: "space-between",
    padding: 20,
    flexDirection: "row",
    width: "100%",
  },
  sideItems: {
    flexDirection: "column",
    position: "absolute",
    right: 8,
    padding: 12,
    borderRadius: 100,
    top: 140,
    height: 240,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sideIcon:{
    marginVertical: 10,
  },
  sendIcon: {
    position: "absolute",
    bottom: 60,
    right: 8,
    padding: 12,
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: 100,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  deleteIcon: {
    position: "absolute",
    top: 60,
    right: 8,
    padding: 12,
    borderRadius: 100,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.5)",
    }
});


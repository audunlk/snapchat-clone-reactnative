import React, {useState} from 'react'
import { View, Text, } from 'react-native'
import NavFooter from '../components/NavFooter'
import { useNavigation } from '@react-navigation/native';
import { Modal, Image, Button } from 'react-native';



export default function SendToScreen( { navigation }  ) {
    const [friendsList, setFriendsList] = useState<string[]>([]);
    const [image, setImage] = useState<string>('');
    const [selectedFriend, setSelectedFriend] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string>('');

    const imagePreviewPropsUri = imagePreview ? {uri: imagePreview} : null;
        

    const handleOnSend = () => {
        // send image to friend
        // navigate to Chat
        navigation.navigate('Chat' as never)
    }

    const handleOnCancel = () => {
        // navigate to Camera
        navigation.navigate('Camera' as never)
    }

    const handleOnSelectFriend = (friend: string) => {
        // set selectedFriend
        // set imagePreview
    }

    const handleOnDeselectFriend = (friend: string) => {
        // set selectedFriend
        // set imagePreview
    }


    const handleOnClickFriend = (friend: string) => {
        // send image to friend
        // navigate to Chat
        navigation.navigate('Chat' as never)
    }


 

    return (
        <View>
            <Modal>
                <Image source={imagePreviewPropsUri} />
                <Button title="Send" onPress={handleOnSend} />
                <Button title="Cancel" onPress={handleOnCancel} />

            </Modal>
            
            <NavFooter />
        </View>
    )
}



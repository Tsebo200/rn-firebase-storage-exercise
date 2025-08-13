import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, Image } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToBucket } from '../services/BucketService';

import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if needed

const AddScreen = () => {

  const [title, setTitle] = useState<string>('')
  const [image, setImage] = useState<string | null>(null)

// Function to pick an image
const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.7,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // const handleSave = async() => {
  //   // TODO: upload image to bucket and then save the memory to firestore
  //   if (!image) {
  //     console.error("No image selected...");
  //     return;
  //   }
  //   const imgaeUrl = await uploadImageToBucket(image, `memory-${title}-${Date.now()}.jpg`);
  //   console.log("Image uploaded successfully:", imgaeUrl);
  //   // TODO: 1. save this imageurl in Firestore with the tittle of the memory
    
  // }


const handleSave = async () => {
  try {
    // 1. Check if required fields are there
    if (!image) {
      console.error("No image selected...");
      return;
    }
    if (!title) {
      console.error("No title provided...");
      return;
    }

    // 2. Upload the image to your bucket
    const imageUrl = await uploadImageToBucket(
      image,
      `memory-${title}-${Date.now()}.jpg`
    );
    console.log("Image uploaded successfully:", imageUrl);

    // 3. Save metadata (title + image URL) to Firestore
    const docRef = await addDoc(collection(db, "memories"), {
      title: title,
      imageUrl: imageUrl,
      createdAt: new Date(),
    });

    console.log("Memory saved with ID:", docRef.id);
  } catch (error) {
    console.error("Error saving memory:", error);
  }
};




  return (
    <View style={styles.container}>
        <TextInput
            style={styles.inputField}
            placeholder="Memory Title"
            onChangeText={newText => setTitle(newText)}
            defaultValue={title}
        />

        {/* TODO: Upload Image */}
    <Button title="Pick an image" onPress={pickImage}/>

{/* Custom Code to preview the image  */}
    {image && (
        <Image 
            source={{ uri: image }} 
            style={{ width: 200, height: 200, marginTop: 20 }} 
        />
    )}

        <TouchableOpacity style={styles.button} >
            <Text  onPress={handleSave} style={styles.buttonText}>Add Memory</Text>
        </TouchableOpacity> 
    </View>
  )
}

export default AddScreen

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    inputField: {
        borderWidth: 2,
        borderColor: 'black',
        marginTop: 15,
        padding: 10
    },
    button: {
        backgroundColor: "green",
        textAlign: 'center',
        padding: 15,
        marginTop: 30
    },
    buttonText: {
        textAlign: 'center',
        color: 'white'
    },
})
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Avatar, Text } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { styles } from "./infoUser.styles";

//eligiendo imagen
export function InfoUser(props) {
  const { setLoading, setLoadingText } = props;
  const { uid, photoURL, displayName, email } = getAuth().currentUser;
  const [avatar, setAvatar] = useState(photoURL);


  const changeAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    

    if (!result.canceled) uploadImage(result.uri);
  };

  //subiendo imagen a firebase
  const uploadImage = async (uri) => {
    
    setLoadingText("Actualizando imagen");
    setLoading(true);

    
    try {
      // Solicitar permisos para acceder a la galería de imágenes
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos insuficientes', 'Se necesita acceso a la galería de imágenes.');
      }
      const blob = await uploadImageAsync(uri);
      const storage = getStorage();
      const storageRef = ref(storage, `huespedes/${uid}/avatar/`);
      uploadBytes(storageRef, blob).then((snapshot) => {
        updatePhotoUrl(snapshot.metadata.fullPath);
      });
      blob.close();
    } catch {(error) => {
      console.log(error);
      setLoading(false);
      setLoadingText("");
    }}
  };

  //actualizar los datos del user
  const updatePhotoUrl = async (imagePath) => {
    const storage = getStorage();
    const imageRef = ref(storage, imagePath);
    const imageUrl = await getDownloadURL(imageRef);
    const auth = getAuth();
    updateProfile(auth.currentUser, { photoURL: imageUrl });
    setAvatar(imageUrl);
    setLoading(false);
  };


  //usamos esto porque el fetch y la conversion a blob no funciona en expo
  async function uploadImageAsync(uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  }



  return (
    <View style={styles.content}>
      <Avatar
        size="large"
        rounded
        containerStyle={styles.avatar}
        icon={{ type: "material", name: "person" }}
        source={{ uri: avatar }}
      >
        <Avatar.Accessory size={24} onPress={changeAvatar} />
      </Avatar>

      <View>
        <Text style={styles.displayName}>{displayName || "Anónimo"} </Text>
        <Text>{email}</Text>
      </View>
    </View>
  );
}

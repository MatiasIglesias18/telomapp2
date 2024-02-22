import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Image, Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { screen } from "../../../utils";
import { styles } from "./ListTelos.styles";
import { storage } from "../../../utils";
import { getFileDownloadUrl } from "../../../utils/functions/getImage";

export function ListTelos(props) {
  const { telos } = props;
  const navigation = useNavigation();

  const goToTelo = (uid) => {
    navigation.navigate(screen.telo.telo, { id: uid });
  };

  function limitCharacters(string, limit) {
    if (string.length > limit) {
      return string.substring(0, limit) + "...";
    } else {
      return string;
    }
  }

  const Item = ({ item }) => {
    const [imagenUrl, setImagenUrl] = useState("");
    const teloData = item.data();
    useEffect(() => {
      const setImage = async (imageRelativePath) => {
        const downloadUrl = await getFileDownloadUrl(storage, imageRelativePath);
        setImagenUrl(downloadUrl);
      };
     setImage(teloData.imagenes[0]);
    });

    return (
        <TouchableOpacity onPress={() => goToTelo(item.id)}>
          <View style={styles.content}>
            {imagenUrl &&<Image source={{ uri: imagenUrl ? imagenUrl : "" }} style={styles.images} />}
            <View>
              <Text style={styles.name}>{teloData.nombre}</Text>
              <Text style={styles.info}>{teloData.direccion}</Text>
              <Text style={styles.info}>
                {limitCharacters(teloData.descripcion, 100)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
  
    );
  };

  return (
    <FlatList data={telos} renderItem={({ item }) => <Item item={item} />} />
  );
}

import React, { useState , useEffect} from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, Image, Rating, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { screen } from "../../../utils";
import { styles } from "./TeloRanking.styles";
import { getFileDownloadUrl } from "../../../utils/functions/getImage";
import { storage } from "../../../utils";

export function TeloRanking(props) {
  const { telo, index } = props;
  const navigation = useNavigation();
  const [imagenUrl, setImagenUrl] = useState(""); 

  const goToTelo = () => {
    navigation.navigate(screen.telo.tab, {
      screen: screen.telo.telo,
      params: {
        id: telo.uid,
      },
    });
  };


  useEffect(() => {
    const setImagenes = async () => {
      if (!telo?.imagenes.length > 0) {
        setImagenUrl("");
        return;
      }
      const downloadUrl = await getFileDownloadUrl(
        storage,
        telo.imagenes[0]
      );
      setImagenUrl(downloadUrl);
    };
    setImagenes();
  }, [telo]);

  const renderMedal = () => {
    if (index > 2) return null;
    let color = "";
    if (index === 0) color = "#FFD700";
    if (index === 1) color = "#BEBEBE";
    if (index === 2) color = "#CD7F32";

    return (
      <Icon
        type="material-community"
        name="medal-outline"
        color={color}
        containerStyle={styles.medal}
      />
    );
  };

  return (
    <TouchableOpacity onPress={goToTelo}>
      <View style={styles.content}>
        {imagenUrl && <Image source={{ uri: imagenUrl }} style={styles.image} />}
        <View style={styles.infoContent}>
          <View style={styles.nameContent}>
            {renderMedal()}
            <Text style={styles.name}>{telo?.nombre}</Text>
          </View>
          <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
            <Rating
              imageSize={15}
              readonly
              startingValue={telo?.ratingPromedio}
            />
            <Text>({telo?.ratingPromedio})</Text>
          </View>
        </View>
        <Text style={styles.description}>{telo?.descripcion}</Text>
      </View>
    </TouchableOpacity>
  );
}

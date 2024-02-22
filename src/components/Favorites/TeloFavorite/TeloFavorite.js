import { style } from "deprecated-react-native-prop-types/DeprecatedViewPropTypes";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, Image, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { screen, db } from "../../../utils";
import { styles } from "./TeloFavorite.styles";
import { BtnFavorites } from "../../Telo";
import { getFileDownloadUrl } from "../../../utils/functions/getImage";
import { storage } from "../../../utils";
export function TeloFavorite(props) {
  const { telo } = props;
  const [imagen, setImagen] = useState("");
  const navigation = useNavigation();

  const goToTelo = () => {
    navigation.navigate(screen.telo.tab, {
      screen: screen.telo.telo,
      params: {
        id: telo.uid,
      },
    });
  };

  useEffect(() => {
    (async () => {
      const downloadUrl = await getFileDownloadUrl(storage, telo.imagenes[0]);
      setImagen(downloadUrl);
    })()
  }, [telo])

  return (
    <TouchableOpacity onPress={goToTelo}>
      <View styles={style.content}>
        <Image source={{ uri: imagen ? imagen : "/no-image" }} style={styles.image} />
        <View style={styles.infoContent}>
          <Text style={styles.name}>{telo.nombre}</Text>
          <BtnFavorites idTelo={telo.uid} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

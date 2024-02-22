import { View, Text, Image } from "react-native";
import { styles } from "./HeaderTipoHabitacion.styles";
import { useEffect, useState } from "react";
import { getFilesDownloadUrlsArray } from "../../../../utils/functions/getImages";
import { storage } from "../../../../utils";
const HeaderTipoHabitacion = ({ tipoHabitacionData }) => {
  const [imagenesArray, setImagenesArray] = useState([]);
  useEffect(() => {
    const setImagenes = async () => {
      if (!tipoHabitacionData.imagenes.length > 0) {
        setImagenesArray([]);
        return;
      }
      const downloadUrlsArray = await getFilesDownloadUrlsArray(
        storage,
        tipoHabitacionData.imagenes
      );
      setImagenesArray(downloadUrlsArray);
    };
    setImagenes();
  }, [tipoHabitacionData]);

  return (
    <View style={styles.content}>
      <View style={styles.titleView}>
        <Text style={styles.name}>{tipoHabitacionData.nombrePublico}</Text>
        {imagenesArray[0] ? (
          <Image
            src={imagenesArray[0]}
            width={100}
            height={100}
            style={styles.image}
          />
        ) : (
          <Text>Este tipo de habitación no tiene imagen para mostrar</Text>
        )}
      </View>
      <Text style={styles.description}>{tipoHabitacionData.descripcion}</Text>
    </View>
  );
};

export default HeaderTipoHabitacion;

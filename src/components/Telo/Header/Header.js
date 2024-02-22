import React, { useEffect } from "react";
import { View, Dimensions } from "react-native";
import { Text, Rating } from "react-native-elements";
import { Image } from "react-native";
import { styles } from "./Header.styles";
import Carousel from "react-native-reanimated-carousel";
import { getFilesDownloadUrlsArray } from "../../../utils/functions/getImages";
import { storage } from "../../../utils";

export function Header(props) {
  const { telo } = props;
  const [elementWidth, setElementWidth] = React.useState(0);
  const [imagenesArray, setImagenesArray] = React.useState([]);
  const width = Dimensions.get("window").width;

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setElementWidth(width);
  };

  useEffect(() => {
    const setImagenes = async () => {
      if (!telo.imagenes.length > 0) {
        setImagenesArray([]);
        return;
      }
      const downloadUrlsArray = await getFilesDownloadUrlsArray(
        storage,
        telo.imagenes
      );
      setImagenesArray(downloadUrlsArray);
    };
    setImagenes();
  });

  return (
    <View style={styles.content}>
      <View style={styles.titleView}>
        <Text style={styles.name}>{telo.nombre}</Text>
      </View>
      {telo.ratingPromedio ? (
        <Rating
          imageSize={20}
          readonly
          startingValue={telo.ratingPromedio | 0}
          style={styles.rating}
        />
      ) : (
        <Text>Este telo aún no tiene calificaciones, deja una mas abajo</Text>
      )}

      {imagenesArray[0] ? (
        <View style={{ flex: 1 }} onLayout={onLayout}>
          <Carousel
            loop
            width={width - 30}
            height={width / 1.5}
            autoPlay={true}
            /*style={{borderWidth: 1}}*/
            autoPlayInterval={3000}
            mode="parallax"
            data={imagenesArray}
            scrollAnimationDuration={1500}
            /*onSnapToItem={(index) =>
            console.log("current index:", index)
          }*/
            renderItem={({ index }) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <Image
                  src={imagenesArray[index]}
                  width={200}
                  height={300}
                  style={styles.image}
                />
              </View>
            )}
          />
        </View>
      ) : (
        <Text>El establecimiento no tiene imagen</Text>
      )}

      <Text style={styles.description}>{telo.descripcion}</Text>
    </View>
  );
}

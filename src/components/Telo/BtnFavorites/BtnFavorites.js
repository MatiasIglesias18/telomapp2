import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import { getAuth } from "firebase/auth";
import {
  doc,
  addDoc,
  getDocs,
  query,
  where,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { size, forEach } from "lodash";
import { db } from "../../../utils";
import { styles } from "./BtnFavorites.styles";

export function BtnFavorites(props) {
  const { idTelo } = props;

  const [isFavorite, setIsFavorite] = useState(undefined);

  const [isReload, setIsReload] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    (async () => {
      const response = await getFavorites();
      if (size(response) > 0) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    })();
  }, [idTelo, isReload]);

  const onReload = () => setIsReload((prevState) => !prevState);

  const getFavorites = async () => {
    const q = query(
      collection(db, `/users/${auth.currentUser.uid}/favoritos`),
      where("uidTelo", "==", idTelo),
    );

    const result = await getDocs(q);

    return result.docs;
  };

  const addFavorite = async () => {
    try {
      // Actualizar localmente antes de la operación en la base de datos
      setIsFavorite(true);

      const data = {
        uidTelo: idTelo,
      };
      const coleccionFavoritos = collection(db, `users/${auth.currentUser.uid}/favoritos`);
      await addDoc(coleccionFavoritos, data);
      // No necesitas llamar a onReload() aquí ya que el cambio local se refleja en setIsFavorite(true)
    } catch (error) {
      console.log(error);
      // Si hay un error, vuelve a establecer el estado a su valor anterior
      setIsFavorite(false);
    }
  };

  const removeFavorite = async () => {
    try {
      // Actualizar localmente antes de la operación en la base de datos
      setIsFavorite(false);

      const response = await getFavorites();
      forEach(response, async (item) => {
        await deleteDoc(doc(db, `users/${auth.currentUser.uid}/favoritos/${item.id}`));
      });
      // No necesitas llamar a onReload() aquí ya que el cambio local se refleja en setIsFavorite(false)
    } catch (error) {
      console.log(error);
      // Si hay un error, vuelve a establecer el estado a su valor anterior
      setIsFavorite(true);
    }
  };

  return (
    <View style={styles.content}>
      {isFavorite !== undefined && (
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          color={isFavorite ? "#EA0C0C" : "#000"}
          size={35}
          onPress={isFavorite ? removeFavorite : addFavorite}
        />
      )}
    </View>
  );
}

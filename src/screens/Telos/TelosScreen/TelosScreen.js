import React, { useState, useEffect } from "react";
import { View } from "react-native";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { LoadingModal } from "../../../components/Shared";
import { ListTelos } from "../../../components/Telos";
import { db } from "../../../utils";
import { styles } from "./TelosScreen.styles";

export function TelosScreen(props) {

  const [telos, setTelos] = useState(null);
  
  //Nos suscribimos a cambios en la lista de telos
  useEffect(() => {
    const q = query(collection(db, "telos"), orderBy("fechaCreacion", "desc"), where("publicado", "==", true), where("habilitado", "==", true));
    onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setTelos([]);
        return;
      }
      setTelos(snapshot.docs);
    });
  }, []);

  return (
    <View style={styles.content}>
      {!telos ? (
        <LoadingModal show text="Cargando" />
      ) : ( 
        <ListTelos telos={telos} />
      )}
    </View>
  );
}

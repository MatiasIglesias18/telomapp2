import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { doc, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Loading, LoadingModal } from "../../../components/Shared";
import {
  Header,
  Info,
  BtnReviewForm,
  Reviews,
  BtnFavorites,
  Servicios
} from "../../../components/Telo";
import { db } from "../../../utils";
import { styles } from "./TeloScreen.styles";

import ListTiposHabitaciones from "../../../components/Telo/ListTiposHabitaciones/ListTiposHabitaciones";
export function TeloScreen(props) {
  const { route } = props;
  const [telo, setTelo] = useState(null);
  const [hasLogged, setHasLogged] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setHasLogged(user ? true : false);
    });

    
  }, []);

  useEffect(() => {
    if (!route.params.id) return;
    setTelo(null);
    onSnapshot(doc(db, "telos", route.params.id), (doc) => {
      setTelo(doc.data());
    });
  }, [route.params.id]);

  if (!telo) return <Loading show text="Cargando" />;

  return (
    <ScrollView style={styles.content}>
      {/*<Carousel arrayImages={telo.images} height={250} width={width} />*/}
      <Header telo={telo} />
      <Info telo={telo} />
      <Servicios telo={telo} />
      {hasLogged && <BtnFavorites idTelo={route.params.id} />}
      <ListTiposHabitaciones teloUid={route.params.id} />
      <Reviews uidTelo={route.params.id} />
      <BtnReviewForm idTelo={route.params.id} />
    </ScrollView>
  );
}

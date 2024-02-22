import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { size, map } from "lodash";
import { db } from "../utils";
import {
  UserNotLogged,
  NotFoundTelos,
  Reserve,
} from "../components/Reserves";
import { Loading } from "../components/Shared";

export function ReserveScreen() {
  const [hasLogged, setHasLogged] = useState(null);
  const [reservas, setReservas] = useState([]);

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setHasLogged(user ? true : false);
    });
  }, []);

  useEffect(() => {
    if (hasLogged) {
      const q = query(
        collection(db, "reservas"),
        where("userUid", "==", auth.currentUser.uid),
        where("estado", "==", 1)
      );

      onSnapshot(q, async (snapshot) => {
        let reservasArray = [];
        snapshot.forEach((doc) => {
          reservasArray.push(doc);
        })
        setReservas(reservasArray);
      });
    }
  }, [hasLogged]);

  if (!hasLogged) return <UserNotLogged />;

  if (!reservas) return <Loading show text="Cargando" />;

  if (size(reservas) < 1) return <NotFoundTelos />;

  return (
    <ScrollView>
      {map(reservas, (reserva) => (
        <Reserve key={reserva?.id} reserva={reserva} />
      ))}
    </ScrollView>
  );
}

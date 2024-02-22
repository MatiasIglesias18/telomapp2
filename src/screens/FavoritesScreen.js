import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { size, map } from "lodash";
import {
  UserNotLogged,
  NotFoundTelos,
  TeloFavorite,
} from "../components/Favorites";
import { Loading } from "../components/Shared";
import { db } from "../utils";

export function FavoritesScreen() {
  const [hasLogged, setHasLogged] = useState(null);

  const [telos, setTelos] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setHasLogged(user ? true : false);
    });
  }, []);

  useEffect(() => {
    if (hasLogged) {
      const q = query(
        collection(db, "users", auth.currentUser.uid, "favoritos")
      );
      onSnapshot(q, async (snapshot) => {
        let teloArray = [];
        for await (const item of snapshot.docs) {
          const data = item.data();
          const docRef = doc(db, "telos", data.uidTelo);
          const docSnap = await getDoc(docRef);

          //elimina el favorito si no existe el doc
          if (!docSnap.exists()) {
            await deleteDoc(doc(db, `users/${auth.currentUser.uid}/favoritos/${item.id}`));
            continue;
          };
          
          const newData = docSnap.data();
          teloArray.push(newData);
        }
        setTelos(teloArray);
      });
    }
  }, [hasLogged]);

  if (!hasLogged) return <UserNotLogged />;

  if (!telos) return <Loading show text="Cargando" />;

  if (size(telos) === 0) return <NotFoundTelos />;

  return (
    <ScrollView>
      {map(telos, (telo) => (
        <TeloFavorite key={telo.uid} telo={telo} />
      ))}
    </ScrollView>
  );
}

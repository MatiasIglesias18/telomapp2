import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  where
} from "firebase/firestore";
import { map } from "lodash";
import { TeloRanking } from "../components/Telos";
import { db } from "../utils";
import { Loading } from "../components";

export function RankingScreen() {
  const [telos, setTelos] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "telos"),
      where("publicado", "==", true),
      where("habilitado", "==", true),
      orderBy("ratingPromedio", "desc"),
      limit(5)
    );
    onSnapshot(q, (snapshot) => {
      setTelos(snapshot.docs);
    });
  }, []);

  if (!telos) return <Loading show text="Cargando..." />;

  return (
    <ScrollView>
      {map(telos, (telo, index) => (
        <TeloRanking key={index} index={index} telo={telo.data()} />
      ))}
    </ScrollView>
  );
}

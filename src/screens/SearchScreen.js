import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { SearchBar, ListItem, Icon, Text } from "react-native-elements";
import {
  collection,
  query,
  startAt,
  endAt,
  limit,
  orderBy,
  getDocs,
  where,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { size, map } from "lodash";
import { Loading } from "../components/Shared";
import { db, screen } from "../utils";

import { SelectorBarrio } from "../components/SearchScreen/SelectorBarrio";
import { SelectorServicios } from "../components/SearchScreen/SelectorServicios/SelectorServicios";

export function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedBarrio, setSelectedBarrio] = useState("");
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  const goToTelo = (idTelo) => {
    navigation.navigate(screen.telo.tab, {
      screen: screen.telo.telo,
      params: {
        id: idTelo,
      },
    });
  };

  useEffect(() => {
    (async () => {
      let q = query(
        collection(db, "telos"),
        orderBy("nombre"),
        startAt(searchText),
        endAt(`${searchText}\uf8ff`),
        limit(20),
        where("publicado", "==", true),
        where("habilitado", "==", true)
      );

      if (selectedBarrio !== "-1" && selectedBarrio !== "" && selectedBarrio !== null) {
        q = query(q, where("barrio", "==", selectedBarrio));
      }

      if (serviciosSeleccionados.length > 0) {
        // Filtrar los resultados en la aplicación para encontrar documentos que contienen todos los valores
        // Filtramos acá porque firestore no tiene una función adecuada, array-contains-any nos da una busqueda que no es la que queremos
        const docsAFiltrar = await getDocs(q);
        const resultadosFiltrados = docsAFiltrar.docs.filter((doc) => {
          const serviciosDocumento = doc.data().servicios;
          return serviciosSeleccionados.every((valor) =>
            serviciosDocumento.includes(valor)
          );
        });
        setSearchResults(resultadosFiltrados);
        return;
      }

      const querySnapshot = await getDocs(q);
      setSearchResults(querySnapshot.docs);
    })();
  }, [searchText, selectedBarrio, serviciosSeleccionados]);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "top",
        flexGrow: 1,
        flexShrink: 0,
        padding: 0,
      }}
    >
      <SearchBar
        placeholder="Buscá tu establecimiento"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <SelectorBarrio
        selectedBarrio={selectedBarrio}
        setSelectedBarrio={setSelectedBarrio}
      />
      <SelectorServicios
        setServiciosSeleccionados={setServiciosSeleccionados}
        serviciosSeleccionados={serviciosSeleccionados}
      />

      {!searchResults && <Loading show text="Cargando" />}

      <ScrollView>
        {size(searchResults) === 0 ? (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text>No hay resultados para tu búsqueda</Text>
          </View>
        ) : (
          map(searchResults, (item) => {
            const data = item.data();
            return (
              <ListItem
                key={data.uid}
                bottomDivider
                onPress={() => goToTelo(data.uid)}
              >
                {/*<Avatar source={{ uri: data.images[0] }} rounded />*/}
                <ListItem.Content>
                  <ListItem.Title>{data.nombre}</ListItem.Title>
                </ListItem.Content>
                <Icon type="material-community" name="chevron-right" />
              </ListItem>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

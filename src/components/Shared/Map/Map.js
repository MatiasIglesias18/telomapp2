import React from "react";
import MapView, { Marker } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { Text } from "react-native";
import openMap from "react-native-open-maps";
import { styles } from "./Map.styles";

export function Map(props) {
  const { location, name } = props;

  const openAppMap = () => {
    openMap({
      latitude: parseFloat(location?.latitud),
      longitude: parseFloat(location?.longitud),
      zoom: 19,
      query: name,
    });
  };

  return (
    <MapView
      initialRegion={{
        latitude: parseFloat(location?.latitud),
        longitude: parseFloat(location?.longitud),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      style={styles.content}
      onPress={openAppMap} // Esta función se ejecutará cuando se toque el mapa
      provider={PROVIDER_GOOGLE}
    >
      <Marker
        coordinate={{
          latitude: parseFloat(location?.latitud),
        longitude: parseFloat(location?.longitud),
        }}
        title={name} // Título del marcador
        description="Descripción del marcador" // Descripción del marcador
      />
    </MapView>
  );
}

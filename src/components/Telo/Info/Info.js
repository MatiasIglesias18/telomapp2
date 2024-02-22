import React from "react";
import { View, Dimensions } from "react-native";
import { Text, ListItem, Icon } from "react-native-elements";
import { map } from "lodash";
import { Map } from "../../Shared";
import { styles } from "./Info.styles";
import Carousel from "react-native-reanimated-carousel";

export function Info(props) {
  const { telo } = props;
  const width = Dimensions.get("window").width;

  const listInfo = [
    {
      text: telo?.direccion ? telo.direccion : "",
      iconType: "material-community",
      iconName: "map-marker",
    },
    {
      text: telo?.telefono ? telo.telefono : "",
      iconType: "material-community",
      iconName: "phone",
    },
    {
      text: telo?.email ? telo.email : "",
      iconType: "material-community",
      iconName: "at",
    },
  ];

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Información sobre el establecimiento:</Text>
      <Map
        location={telo?.geopoint ? telo.geopoint : { latitud: 0, longitud: 0 }}
        name={telo.nombre}
      />
      {map(listInfo, (item, index) =>
        item.text ? (
          <ListItem key={index} bottomDivider>
            <Icon type={item.iconType} name={item.iconName} color="#F760A2" />
            <ListItem.Content>
              <ListItem.Title>{item.text}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ) : null
      )}
    </View>
  );
}

import React from "react";
import { View } from "react-native";
import { Text, ListItem, Icon } from "react-native-elements";
import { map } from "lodash";
import { styles } from "./InfoTipoHabitacion.styles";

export default function InfoTipoHabitacion({ tipoHabitacionData }) {
  const listInfo = [
    {
      text: tipoHabitacionData?.precio ? tipoHabitacionData.precio : "",
      iconType: "material-community",
      iconName: "currency-usd",
    },
  ];

  return (
    <View style={styles.content}>
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

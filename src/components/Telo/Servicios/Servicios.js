import { styles } from "./Servicios.styles";
import { View } from "react-native";
import { Text, ListItem, Icon } from "react-native-elements";
import { map } from "lodash";
import { serviciosTelos } from "../../../utils/serviciosTelos";

export const Servicios = ({ telo }) => {
  if (!telo)
    return (
      <View style={styles.content}>
        <Text>No se encuentra el Telo</Text>
      </View>
    );
  const serviciosArray = telo?.servicios ? telo.servicios : [];
  if (serviciosArray.length === 0)
    return (
      <View style={styles.content}>
        <Text>No hay información sobre los servicios ofrecidos</Text>
      </View>
    );

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Servicios:</Text>
      {map(serviciosArray, (item, index) => {
        return (
          <ListItem key={index} bottomDivider>
            <Icon type={item.iconType} name={item.iconName} color="#F760A2" />
            <ListItem.Content>
              <ListItem.Title>{serviciosTelos[parseInt(item)].label}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        );
      })}
    </View>
  );
};

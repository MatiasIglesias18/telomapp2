import { View } from "react-native";

import { styles } from "./TipoHabitacion.styles";

import HeaderTipoHabitacion from "./HeaderTipoHabitacion/HeaderTipoHabitacion";
import InfoTipoHabitacion from "./InfoTipoHabitacion/InfoTipoHabitacion";
import { BtnReserve } from "../BtnReserve";

const TipoHabitacion = ({ tipoHabitacion, teloUid }) => {
  return (
    <View style={styles.content}>
      <HeaderTipoHabitacion tipoHabitacionData={tipoHabitacion.data()} />
      <InfoTipoHabitacion tipoHabitacionData={tipoHabitacion.data()} />
      <BtnReserve tipoHabitacion={tipoHabitacion} teloUid={teloUid} />
    </View>
  );
};

export default TipoHabitacion;

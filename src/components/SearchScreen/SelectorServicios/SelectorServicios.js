import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { serviciosTelos } from "../../../utils/serviciosTelos";

export function SelectorServicios({
  serviciosSeleccionados,
  setServiciosSeleccionados,
}) {
  const handleCheckboxChange = (isChecked, servicioId) => {
    if (isChecked) {
      setServiciosSeleccionados([...serviciosSeleccionados, servicioId]);
    } else {
      const updatedServicios = serviciosSeleccionados.filter(
        (id) => id !== servicioId
      );
      setServiciosSeleccionados(updatedServicios);
    }
  };

  return (
    <View style={styles.container}>
      {serviciosTelos.map((servicio, index) => (
        <View style={styles.section} key={index}>
          <Checkbox
            style={styles.checkbox}
            value={serviciosSeleccionados.includes(servicio.id)}
            onValueChange={(isChecked) =>
              handleCheckboxChange(isChecked, servicio.id)
            }
          />
          <Text style={styles.paragraph}>{servicio.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 0,
    flexDirection: 'row', // O 'row' para una cuadrícula horizontal
    flexWrap: 'wrap', // Para ajustar los elementos
    justifyContent: 'flex-start', // Alineación principal
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});

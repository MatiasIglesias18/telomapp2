import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { Icon, Text, Image, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db, screen } from "../../../utils";
import { styles } from "./Reserve.style";
import { storage } from "../../../utils";
import { getFileDownloadUrl } from "../../../utils/functions/getImage";

export function Reserve({ reserva }) {
  const [imagenUrl, setImagenUrl] = useState("");
  const dataReserva = reserva?.data();
  const fechaInicio = dataReserva?.fechaReserva.toDate();
  const fechaVencimiento = dataReserva?.fechaVencimiento.toDate();

  const [teloDocData, setTeloDocData] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    async function establecerInfo() {
      const teloRef = doc(db, "telos", dataReserva?.teloUid);
      const teloDoc = await getDoc(teloRef);
      if (!teloDoc.exists()) {
        setTeloDocData(null);
        return;
      }
      setTeloDocData(teloDoc.data());
    }

    establecerInfo();
  }, [dataReserva]);

  //  Obtener imagen del telo
  useEffect(() => {
    if (!teloDocData) {
      return;
    }
    if (!teloDocData?.imagenes[0]) {
      return;
    }
    (async () => {
      const downloadUrl = await getFileDownloadUrl(
        storage,
        teloDocData?.imagenes[0]
      );
      setImagenUrl(downloadUrl);
    })();
  }, [teloDocData]);

  const goToTelo = () => {
    navigation.navigate(screen.telo.tab, {
      screen: screen.telo.telo,
      params: {
        id: dataReserva.teloUid,
      },
    });
  };

  const onRemoveAlert = () => {
    Alert.alert(
      "Cancelar reserva",
      `¿Estás seguro de cancelar la reserva?`,
      [
        {
          text: "No",
        },
        {
          text: "Si",
          onPress: () => onRemoveReserve(),
        },
      ],
      { cancelable: false }
    );
  };

  const onRemoveReserve = async () => {
    const teloRef = doc(db, "telos", dataReserva?.teloUid);
    const habitacionUid = dataReserva.habitacionUid;
    const habitacionRef = doc(teloRef, "habitaciones", habitacionUid);

    const batch = writeBatch(db);

    try {
      batch.update(reserva.ref, { estado: 0 });
      batch.update(habitacionRef, { estado: 1, reservaUid: "" });

      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {teloDocData && (
        <TouchableOpacity onPress={goToTelo}>
          <View style={styles.content}>
            <Image source={{ uri: imagenUrl }} style={styles.image} />
            <View style={styles.infoContent}>
              <Text style={styles.name}>{teloDocData.nombre}</Text>
              <Text style={styles.codigo}>
                Tu código de reserva es: {reserva?.data().codigo}
              </Text>
              <Text style={styles.data}>
                Tipo de Habitación:{" "}
                {reserva?.data().tipoHabitacionNombrePublico}
              </Text>
              <Text style={styles.data}>
                Número de habitación: {reserva?.data().numeroHabitacion}
              </Text>
              <Text style={styles.data}>Precio: ${reserva?.data().precio}</Text>
              <Text style={styles.data}>
                Reservado a las: {fechaInicio.toLocaleString()}
              </Text>
              <Text style={styles.data}>
                Vence a las: {fechaVencimiento.toLocaleString()}
              </Text>
              <Button
                title="Cancelar Reserva"
                buttonStyle={styles.buttonCancelarReserva}
                onPress={() => onRemoveAlert()}
              />
              <Icon
                type="material-community"
                name="calendar-check-outline"
                color="#F760A2"
                size={35}
                containerStyle={styles.iconContent}
              />
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
}

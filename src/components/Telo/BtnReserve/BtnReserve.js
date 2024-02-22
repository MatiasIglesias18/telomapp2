import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { Text, Button } from "react-native-elements";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
  collection,
  where,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { screen, db } from "../../../utils";
import { styles } from "./BtnReserve.styles";

export function BtnReserve({ tipoHabitacion, teloUid }) {
  const tipoHabitacionUid = tipoHabitacion?.id;
  const tipoHabitacionData = tipoHabitacion?.data();

  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState(false);
  const [reservaExistente, setReservaExistente] = useState(false);
  const [hasLogged, setHasLogged] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const auth = getAuth();
  const navigation = useNavigation();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setHasLogged(user ? true : false);
    });
  }, []);

  //Define estado de si hay o no habitaciones disponibles
  useEffect(() => {
    //Chequea si existe una habitacion disponible en el telo
    // que sea del tipo de habitacion que estamos reservando
    const querySnapshotHabitaciones = query(
      collection(db, "telos", teloUid, "habitaciones"),
      where("tipoHabitacionUid", "==", tipoHabitacionUid),
      where("estado", "==", 1)
    );

    const unsuscribe = onSnapshot(
      querySnapshotHabitaciones,
      (querySnapshot) => {
        if (querySnapshot.empty) {
          setHabitacionesDisponibles(false);
        } else {
          setHabitacionesDisponibles(true);
        }
      }
    );

    return unsuscribe;
  }, [teloUid, tipoHabitacion]);

  //Define estado de si hay reserva activa
  useEffect(() => {
    if (!hasLogged) {
      return;
    }
    const querySnapshotReservas = query(
      collection(db, "reservas"),
      where("teloUid", "==", teloUid),
      where("userUid", "==", auth.currentUser.uid),
      where("estado", "==", 1)
    );

    const unsuscribe = onSnapshot(querySnapshotReservas, (querySnapshot) => {
      if (querySnapshot.empty) {
        setReservaExistente(false);
      } else {
        setReservaExistente(true);
      }
    });

    return unsuscribe;
  }, [teloUid, tipoHabitacion, hasLogged]);

  const handleAddReserve = async () => {
    setProcesando(true);
    const [success, error] = await addReserve(
      teloUid,
      tipoHabitacionUid,
      tipoHabitacionData
    );
    if (error) {
      console.log(error);
      setProcesando(false);
      return;
    }
    if (!success) {
      console.log("No se detectó el success");
      setProcesando(false);
      return;
    }
    setProcesando(false);
  };

  const addReserve = async (teloUid, tipoHabitacionUid, tipoHabitacionData) => {
    try {
      const reservasCol = collection(db, "reservas");

      //Chequea si existe una reserva activa
      const querySnapshotReservas = query(
        reservasCol,
        where("teloUid", "==", teloUid),
        where("userUid", "==", auth.currentUser.uid),
        where("estado", "==", 1)
      );
      const snapshotReservas = await getDocs(querySnapshotReservas);

      if (!snapshotReservas.empty) {
        // There is an active reservation

        return [, "Ya hay una reserva activa"];
      }

      //Chequea si existe una habitacion disponible en el telo que sea del tipo de habitacion que estamos reservando
      const querySnapshotHabitaciones = query(
        collection(db, "telos", teloUid, "habitaciones"),
        where("tipoHabitacionUid", "==", tipoHabitacionUid)
      );

      const snapshotHabitaciones = await getDocs(querySnapshotHabitaciones);

      if (snapshotHabitaciones.empty) {
        return [
          ,
          "No hay habitaciones disponibles para este tipo de habitaciones",
        ];
      }

      const habitacion = snapshotHabitaciones.docs[0];
      const numeroHabitacion = habitacion.data().numeroHabitacion;

      const tipoHabitacionRef = doc(
        db,
        "telos",
        teloUid,
        "tiposHabitacion",
        tipoHabitacionUid
      );

      const tipoHabitacionDoc = await getDoc(tipoHabitacionRef);
      if (!tipoHabitacionDoc.exists()) {
        return [, "El tipo de habitación no existe"];
      }

      const TeloDoc = await getDoc(doc(db, "telos", teloUid));

      if (!TeloDoc.exists()) {
        return [, "El telo no existe"];
      }

      const teloDocData = TeloDoc.data();

      if (!teloDocData) {
        return [, "El telo no existe"];
      }

      if (!teloDocData.operadorUid) {
        return [, "No se pudo recuperar el operador del telo"];
      }

      const generateCode = () => {
        let code = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const codeLength = 6;

        for (let i = 0; i < codeLength; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          code += characters[randomIndex];
        }

        return code;
      };

      const code = generateCode();
      const fechaCreada = new Date();

      // Sumar 5min horas a la fecha actual
      const fechaVencimiento = new Date(
        fechaCreada.getTime() + 5 * 60 * 1000
      ); // 5min en milisegundos

      const data = {
        teloUid: teloUid,
        teloRef: tipoHabitacionRef,
        tipoHabitacionUid: tipoHabitacionUid,
        tipoHabitacionName: tipoHabitacionData.nombre,
        tipoHabitacionNombrePublico: tipoHabitacionData.nombrePublico,
        habitacionRef: habitacion.ref,
        habitacionUid: habitacion.id,
        numeroHabitacion: numeroHabitacion,
        userUid: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        operadorUid: teloDocData?.operadorUid,
        codigo: code,
        estado: 1,
        precio: tipoHabitacionData.precio,
        fechaReserva: fechaCreada,
        fechaVencimiento: fechaVencimiento,
      };

      
      const reservaCreadaRef = await addDoc(reservasCol, data);
      await updateDoc(habitacion.ref, {
        estado: 2,
        reservaUid: reservaCreadaRef.id,
      });

      Alert.alert(
        "¡Habitación reservada!",
        `Presentá este código "${data?.codigo}" en el establecimiento para efectivizar tu reserva`,
        [
          {
            text: "¡Anotado!",
            onPress: () => {
              navigation.navigate(screen.reserve.reserve);
            },
          },
        ],
        { cancelable: false }
      );

      return [true, null];
    } catch (error) {
      return [, error];
    }
  };

  if (hasLogged && reservaExistente && !procesando) {
    return (
      <View style={styles.content}>
        <Text style={styles.text}>
          Ya tenés una reserva en este establecimiento.
        </Text>
      </View>
    );
  }

  if (hasLogged && !habitacionesDisponibles && !procesando) {
    return (
      <View style={styles.content}>
        <Text style={styles.text}>
          En este momento no hay habitaciones disponibles. Espera un momento a
          que se desocupe alguna o elige otro tipo de habitación.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      {hasLogged ? (
        <Button
          title={!procesando ? "Hacé tu reserva" : "Procesando..."}
          disabled={procesando}
          icon={{
            type: "material-community",
            name: "calendar-check-outline",
            color: "#ccc",
          }}
          buttonStyle={styles.btnReview}
          onPress={handleAddReserve}
        />
      ) : (
        <Text style={styles.text}>
          Para realizar una reserva necesitas iniciar sesión.{" "}
          <Text
            style={styles.textClick}
            onPress={() => {
              navigation.navigate(screen.account.tab, {
                screen: screen.account.login,
              });
            }}
          >
            Pulsa aquí para iniciar sesión
          </Text>
        </Text>
      )}
    </View>
  );
}

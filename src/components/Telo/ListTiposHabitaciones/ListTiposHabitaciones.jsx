import { useEffect, useState} from "react";
import { db } from "../../../utils";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import TipoHabitacion from "../TipoHabitacion/TipoHabitacion";

const ListTiposHabitaciones = ({ teloUid }) => {
  const [tiposHabitaciones, setTiposHabitaciones] = useState([]);
  const obtenerTiposHabitacion = async () => {
    
  };

  useEffect(() => {
    //Obtiene tiposHabitacion del telo
    const qTiposHabitacion = collection(
      db,
      "telos",
      teloUid,
      "tiposHabitacion"
    );
    const unsuscribe = onSnapshot(qTiposHabitacion, (snapshot) => {
      if (snapshot.empty) {
        setTiposHabitaciones([]);
      }
      const arrayTiposHabitaciones =  []
      snapshot.forEach((doc) => {
        arrayTiposHabitaciones.push(doc);
      });
      setTiposHabitaciones(arrayTiposHabitaciones);
    });
    return unsuscribe;
  }, []);

  return (
    <>
      {tiposHabitaciones.map((tipoHabitacion, index) => (
        <TipoHabitacion
          key={tipoHabitacion.id}
          tipoHabitacion={tipoHabitacion}
          teloUid={teloUid}
        />
      ))}
    </>
  );
};

export default ListTiposHabitaciones;

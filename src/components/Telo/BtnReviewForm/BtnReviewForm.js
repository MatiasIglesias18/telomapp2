import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-elements";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { query, collection, where, onSnapshot, doc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { size } from "lodash";
import { screen, db } from "../../../utils";
import { styles } from "./BtnReviewForm.styles";

export function BtnReviewForm(props) {
  const { idTelo } = props;

  const [hasLogged, setHasLogged] = useState(false);

  const [hasReview, setHasReview] = useState(false);

  const navigation = useNavigation();

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setHasLogged(user ? true : false);
    });
  }, []);

  useEffect(() => {
    const teloRef = doc(db, "telos", idTelo);
    if (hasLogged) {
      const q = query(
        collection(teloRef, "reviews"),
        where("userUid", "==", auth.currentUser.uid)
      );
      onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          setHasReview(true);
        }
      });
    }
  }, [hasLogged]);

  const goToLogin = () => {
    navigation.navigate(screen.account.tab, {
      screen: screen.account.login,
    });
  };

  const goToAddReview = () => {
    navigation.navigate(screen.telo.AddTeloReviewScreen, {
      idTelo,
    });
  };

  if (hasLogged && hasReview) {
    return (
      <View style={styles.content}>
        <Button
          title="Escribe tu opinión"
          disabled={true}
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "gray",
          }}
          buttonStyle={styles.btnReview}
          onPress={goToAddReview}
        />
        <Text style={{color: "gray", textAlign: "center", padding: 5, marginBottom: 10}}>
          Ya dejaste un comentario anteriormente
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      {hasLogged ? (
        <Button
          title="Escribe tu opinión"
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#6B2A46",
          }}
          buttonStyle={styles.btnReview}
          onPress={goToAddReview}
        />
      ) : (
        <Text style={styles.text} onPress={goToLogin}>
          Para dejar tu opinión necesitas iniciar sesión.
          <Text style={styles.textClick}>Pulsa aquí para iniciar sesión</Text>
        </Text>
      )}
    </View>
  );
}

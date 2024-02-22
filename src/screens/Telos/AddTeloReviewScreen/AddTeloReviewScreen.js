import React from "react";
import { View } from "react-native";
import { AirbnbRating, Input, Button } from "react-native-elements";
import { useFormik } from "formik";
import Toast from "react-native-toast-message";
import { getAuth } from "firebase/auth";
import {
  doc,
  collection,
  updateDoc,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { map, mean } from "lodash";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../../utils";
import { v4 as uuid } from "uuid";
import { initialValues, validationSchema } from "./AddTeloReviewScreen.data";
import { styles } from "./AddTeloReviewScreen.styles";

export function AddTeloReviewScreen(props) {
  const { route } = props;
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const auth = getAuth();
        const teloRef = doc(db, "telos", route.params.idTelo);
        const reviewCol = collection(teloRef, "reviews");

        const data = {
          creadoEl: new Date(),
          teloUid: route.params.idTelo,
          userNombre: auth.currentUser.displayName,
          userAvatar: auth.currentUser.photoURL,
          userUid: auth.currentUser.uid,
          rating: formValue.rating,
          titulo: formValue.title,
          comentario: formValue.comment,
        };

        await addDoc(reviewCol, data);
        await updateTelo(teloRef, reviewCol);
      } catch (error) {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error al enviar la calificación",
        });
      }
    },
  });

  const updateTelo = async (teloRef, reviewCol) => {
    try {
      const snapShotReviews = await getDocs(reviewCol);

      const reviewsDocs = snapShotReviews.docs;

      const arrayStars = map(reviewsDocs, (review) => review.data().rating);

      const media = mean(arrayStars);

      await updateDoc(teloRef, {
        ratingPromedio: media,
      });
    } catch (error) {
      console.log(error);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.content}>
      <View>
        <View style={styles.ratingContent}>
          <AirbnbRating
            count={5}
            reviews={["Pésimo", "Malo", "Normal", "Muy bueno", "Me encantó"]}
            defaultRating={formik.values.rating}
            size={35}
            onFinishRating={(rating) => formik.setFieldValue("rating", rating)}
          />
        </View>
        <View>
          <Input
            placeholder="Título"
            onChangeText={(text) => formik.setFieldValue("title", text)}
            errorMessage={formik.errors.title}
          />
          <Input
            placeholder="Comentario"
            multiline
            inputContainerStyle={styles.comment}
            onChangeText={(text) => formik.setFieldValue("comment", text)}
            errorMessage={formik.errors.comment}
          />
        </View>
      </View>
      <Button
        title="Enviar comentario"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
      />
    </View>
  );
}

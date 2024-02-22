import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Text, AirbnbRating, ListItem, Avatar } from "react-native-elements";
import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  doc,
} from "firebase/firestore";
import { map } from "lodash";
import { DateTime } from "luxon";
import { Loading } from "../../Shared";
import { db } from "../../../utils";
import { styles } from "./Reviews.styles";
import "intl";
import "intl/locale-data/jsonp/es";

export function Reviews({ uidTelo }) {
  if (!uidTelo) return null;

  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    const teloRef = doc(db, "telos", uidTelo);
    const q = query(
      collection(teloRef, "reviews"),
      orderBy("creadoEl", "desc")
    );
    onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setReviews([]);
        return;
      }
      setReviews(snapshot.docs);
    });
  }, []);
  
  if (!reviews) return <Loading show text="Cargando" />;
  return (
    <View style={styles.content}>
    <Text style={styles.seccionTitle}>Comentarios</Text>
      {map(reviews, (review) => {
        const data = review.data();
        const createReview = data.creadoEl.toDate();
        return (
          <ListItem key={review.id} bottomDivider containerStyle={styles.review}>
            <Avatar source={data?.userAvatar ? { uri: data.userAvatar } : {}} size={60} rounded containerStyle={{ backgroundColor: "#cccccc", alignSelf: "flex-start" }} titleStyle={{ color: "white" }} />
            <ListItem.Content>
              <ListItem.Title style={styles.title}>{data.titulo}</ListItem.Title>
              <View style={styles.subTitle}>
                <Text style={styles.comment}>{data.comentario}</Text>
                <View style={styles.contentRatingDate}>
                  <AirbnbRating
                    defaultRating={data.rating}
                    showRating={false}
                    size={15}
                    isDisabled
                    starContainerStyle={styles.starContainer}
                  />
                  <Text style={styles.date}>
                    {DateTime.fromISO(createReview.toISOString()).toFormat(
                      "dd/LL/yyyy - hh:mm"
                    )}
                  </Text>
                </View>
              </View>
            </ListItem.Content>
          </ListItem>
        );
      })}
    </View>
  );
}

import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import fetchReviewsFromUser from "../../services/reviews/fetchReviews";
import fetchReviewsFromBeer from "../../services/reviews/fetchReviewsFromBeer";
import { StyleSheet } from "react-native";

/*{
            "id": 1,
            "text": "test_review for beer 1",
            "rating": "5.0",
            "user_id": 1,
            "beer_id": 1,
            "created_at": "2024-09-05T17:14:49.146Z",
            "updated_at": "2024-09-05T17:14:49.146Z",
            "user_handle": "RenatoAguirre"
        }
            */

type Review = {
  id: number;
  text: string;
  rating: string;
  user_id: number;
  beer_id: number;
  created_at: string;
  updated_at: string;
  user_handle: string;
};

const filterUserReviews = (reviews: Review[], userId: number) => {
  return reviews.filter((review) => review.user_id !== userId);
};

const filterBeerReviews = (reviews: Review[], beerId: any) => {
  return reviews.filter((review) => review.beer_id == beerId);
};

function ReviewList({
  user_id,
  beer_id,
}: {
  user_id: string;
  beer_id: string | string[];
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsFromUser, setReviewsFromUser] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const initData = async () => {
      try {
        const reviewsFromU = await fetchReviewsFromUser(user_id);
        const reviewsFromB = await fetchReviewsFromBeer(beer_id);
        setReviews(filterUserReviews(reviewsFromB, parseInt(user_id)));
        setReviewsFromUser(filterBeerReviews(reviewsFromU, beer_id));
      } catch (error) {
        setErrorMessage("Error fetching reviews");
        console.error("Error fetching reviews", error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [user_id]);

  return (
    <View>
      {loading && <Text>Loading...</Text>}
      {errorMessage && <Text>{errorMessage}</Text>}
      {!loading && !errorMessage && (
        <>
          <View>
            <Text style={styles.title}>Your Reviews</Text>
            {reviewsFromUser.length === 0 && <Text>No reviews from you</Text>}
            {reviewsFromUser.length !== 0 &&
              reviewsFromUser.map((review) => (
                <View key={review.id} style={styles.review}>
                  <Text>{review.text}</Text>
                  <Text>{review.rating}</Text>
                  <Text>{review.created_at}</Text>
                </View>
              ))}
            <Text style={styles.title}>Reviews for this beer</Text>
            {reviews.length === 0 && <Text>No reviews for this beer</Text>}
            {reviews.length !== 0 &&
              reviews.map((review) => (
                <View key={review.id} style={styles.review}>
                  <Text>@{review.user_handle}</Text>
                  <Text>{review.text}</Text>
                  <Text>{review.rating}</Text>
                </View>
              ))}

            {/*
            <FlatList
              data={reviewsFromUser}
              renderItem={({ item }) => {
                return (
                  <View>
                    <Text>{item.text}</Text>
                    <Text>{item.rating}</Text>
                    <Text>{item.created_at}</Text>
                  </View>
                );
              }}
              keyExtractor={(item) => item.id.toString()}
            />
            <Text>Reviews for this beer</Text>
            <FlatList
              data={reviews}
              renderItem={({ item }) => {
                return (
                  <View>
                    <Text>{item.user_handle}</Text>
                    <Text>{item.text}</Text>
                    <Text>{item.rating}</Text>
                  </View>
                );
              }}
              keyExtractor={(item) => item.id.toString()}
            /> */}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
  review: {
    margin: 10,
    padding: 10,
    backgroundColor: "#f9c2ff",
    borderRadius: 10,
  },
});

export default ReviewList;

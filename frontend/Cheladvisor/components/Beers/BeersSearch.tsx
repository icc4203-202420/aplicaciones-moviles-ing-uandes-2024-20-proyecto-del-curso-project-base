import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import { Card } from "react-native-elements";
import fetchBeers from "../../services/beers/fetchAllBeers";
import makeReview from "../../services/reviews/makeReview";
import { getItem } from "../../util/Storage";

interface Beer {
  id: number;
  name: string;
  style: string;
  avg_rating: number | null;
  hop?: string;
  yeast?: string;
  malts?: string;
  ibu?: string;
  alcohol?: string;
  blg?: string;
}

interface BeersProps {
  searchQuery: string;
}

const Beers: React.FC<BeersProps> = ({ searchQuery }) => {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBeerId, setExpandedBeerId] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState("");

  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewedbeerId, setReviewedbeerId] = useState<number | null>(null);

  useEffect(() => {
    const getBeers = async () => {
      try {
        const response = await fetchBeers();
        setBeers(response);
      } catch (error) {
        console.error("Error fetching beers:", error);
      } finally {
        setLoading(false);
      }
    };
    getBeers();
  }, []);

  const filteredBeers = beers.filter((beer) =>
    beer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBeerClick = (beerId: number) => {
    if (expandedBeerId === beerId) {
      setExpandedBeerId(null);
      setReviewText("");
      setRating(0);
      setErrorMessage("");
    } else {
      setExpandedBeerId(beerId);
      setReviewText("");
      setRating(0);
      setErrorMessage("");
    }
  };

  const handleSubmitReview = async (beerId: number) => {
    const userId = await getItem("userId");
    if (reviewText.length < 15) {
      setErrorMessage("La reseña debe tener al menos 15 caracteres.");
      return;
    }
    if (rating === 0 || rating > 5) {
      setErrorMessage("Por favor, califica la cerveza.");
      return;
    }

    const reviewData = {
      beer_id: beerId,
      rating,
      text: reviewText,
    };

    try {
      const response = await makeReview(reviewData, userId);

      setReviewSubmitted(true);
      setReviewText("");
      setRating(0);
      setErrorMessage("");
      setReviewedbeerId(beerId);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <View>
      {loading && <Text>Loading...</Text>}
      {!loading && (
        <FlatList
          data={filteredBeers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity onPress={() => handleBeerClick(item.id)}>
                <Card containerStyle={{ padding: 10 }}>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Divider />
                  <Text style={{ marginBottom: 10 }}>Style: {item.style}</Text>
                  <Text>
                    Rating: {item.avg_rating !== null ? item.avg_rating : "N/A"}
                  </Text>

                  {expandedBeerId === item.id && (
                    <View>
                      <Text>Hop: {item.hop || "N/A"}</Text>
                      <Text>Yeast: {item.yeast || "N/A"}</Text>
                      <Text>Malts: {item.malts || "N/A"}</Text>
                      <Text>IBU: {item.ibu || "N/A"}</Text>
                      <Text>Alcohol: {item.alcohol || "N/A"}</Text>
                      <Text>BLG: {item.blg || "N/A"}</Text>

                      <Text>Rate this beer:</Text>
                      <View style={{ flexDirection: "row", marginBottom: 10 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <TouchableOpacity
                            key={star}
                            onPress={() => setRating(star)}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                color: star <= rating ? "gold" : "lightgray",
                              }}
                            >
                              ★
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <TextInput
                        placeholder="Write your review (optional)"
                        value={reviewText}
                        onChangeText={setReviewText}
                        style={{
                          borderWidth: 1,
                          borderColor: "#ccc",
                          padding: 10,
                          borderRadius: 5,
                          marginBottom: 10,
                        }}
                      />

                      {errorMessage ? (
                        <Text style={{ color: "red" }}>{errorMessage}</Text>
                      ) : null}
                      {reviewSubmitted && item.id == reviewedbeerId && (
                        <Text>Review submitted!</Text>
                      )}

                      <Button
                        title="Submit Review"
                        onPress={() => handleSubmitReview(item.id)}
                      />
                    </View>
                  )}
                </Card>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Beers;

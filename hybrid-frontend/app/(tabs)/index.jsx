import React, { useState, useEffect } from "react";
import { Link } from "expo-router";
import { Text, View, Button, FlatList, StyleSheet, TextInput } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { createConsumer } from "@rails/actioncable";
import { WS_URL } from "@env";
import { EventRegister } from "react-native-event-listeners";

global.addEventListener = EventRegister.addEventListener;
global.removeEventListener = EventRegister.removeEventListener;

export default function Home() {
  const { logout } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const cable = createConsumer(WS_URL);
    const channel = cable.subscriptions.create("FeedChannel", {
      received(data) {
        setReviews((prevReviews) => [data, ...prevReviews]);
        setFilteredReviews((prevReviews) => [data, ...prevReviews]); 
      },
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredReviews(reviews); 
    } else {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const filtered = reviews.filter(
        (review) =>
          review?.beer?.name?.toLowerCase().includes(lowerCaseTerm) ||
          review?.user?.name?.toLowerCase().includes(lowerCaseTerm) ||
          review?.text?.toLowerCase().includes(lowerCaseTerm)
      );
      setFilteredReviews(filtered);
    }
  }, [searchTerm, reviews]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>

      {/* Campo de búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by beer, user, or review..."
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />

      <FlatList
        data={filteredReviews}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <Link style={styles.beerItem} href={`(views)/beer/${item?.beer?.id}`}>
            <View style={styles.reviewContainer}>
              <Text style={styles.beerName}>{item?.beer?.name}</Text>
              <Text style={styles.userName}>{item?.user?.name}:</Text>
              <Text style={styles.reviewText}>{item?.text}</Text>
              <Text style={styles.rating}>Rating: {item?.rating}</Text>
            </View>
          </Link>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reviews match your search.</Text>
        }
      />

      <Button title="Logout" onPress={logout} color="#C58100" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F1DCA7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#C58100",
    marginBottom: 20,
    textAlign: "center",
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#FFF",
  },
  reviewContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    height: 120,
    width: "100%",
    backgroundColor: "#FFF",
  },
  beerItem: {
    marginBottom: 10,
  },
  beerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#C58100",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#564c3d",
  },
  reviewText: {
    fontSize: 14,
    fontStyle: "italic",
    marginVertical: 5,
  },
  rating: {
    fontSize: 14,
    color: "#888",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
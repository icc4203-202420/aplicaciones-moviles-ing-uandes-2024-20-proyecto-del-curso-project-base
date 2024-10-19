import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Button } from "react-native-elements";
import { useRouter } from "expo-router";
import { getItem } from "expo-secure-store";

import fetchBeer from "../../services/beers/fetchBeer";

import { View, StyleSheet } from "react-native";
import ReviewList from "../../components/Reviews/ReviewList";
import { ScrollView } from "react-native";
/* 
{
    "beer": {
        "avg_rating": 2.75,
        "brand_id": 1,
        "id": 2,
        "beer_type": null,
        "created_at": "2024-08-27T14:19:48.272Z",
        "updated_at": "2024-10-18T22:02:20.155Z",
        "name": "Dreadnaught IPA",
        "style": "India Pale Ale",
        "hop": "Crystal",
        "yeast": "1099 - Whitbread Ale",
        "malts": "Special roast",
        "ibu": "72 IBU",
        "alcohol": "7.1%",
        "blg": "5.7°Blg"
    },*/

/* beerInfo 
{
    "beer": {
        "avg_rating": 2.75,
        "brand_id": 1,
        "id": 2,
        "beer_type": null,
        "created_at": "2024-08-27T14:19:48.272Z",
        "updated_at": "2024-10-18T22:02:20.155Z",
        "name": "Dreadnaught IPA",
        "style": "India Pale Ale",
        "hop": "Crystal",
        "yeast": "1099 - Whitbread Ale",
        "malts": "Special roast",
        "ibu": "72 IBU",
        "alcohol": "7.1%",
        "blg": "5.7°Blg"
    },
    "bars_beer": [
        {
            "id": 16,
            "name": "Spice Steakhouse",
            "latitude": 36.835557891406694,
            "longitude": -178.4810708684968,
            "address_id": 61,
            "created_at": "2024-09-08T20:22:29.661Z",
            "updated_at": "2024-09-08T20:22:29.661Z"
        },
        {
            "id": 19,
            "name": "Fast Pizza",
            "latitude": -64.56926247520771,
            "longitude": 64.38010318506196,
            "address_id": 77,
            "created_at": "2024-09-08T20:23:36.285Z",
            "updated_at": "2024-09-08T20:23:36.285Z"
        }
    ],
    "brand": {
        "id": 1,
        "name": "Amstel",
        "created_at": "2024-08-27T14:19:48.255Z",
        "updated_at": "2024-08-27T14:19:48.255Z",
        "brewery_id": 1
    },
    "brewery": {
        "id": 1,
        "name": "Halvorson, Kuphal and Turner",
        "estdate": 1671,
        "created_at": "2024-08-27T14:19:48.249Z",
        "updated_at": "2024-08-27T14:19:48.249Z"
    }
}*/

type Beer = {
  avg_rating: number;
  brand_id: number;
  id: number;
  beer_type: string;
  created_at: string;
  updated_at: string;
  name: string;
  style: string;
  hop: string;
  yeast: string;
  malts: string;
  ibu: string;
  alcohol: string;
  blg: string;
};

type BeerInfo = {
  beer: Beer;
  bars_beer: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    address_id: number;
    created_at: string;
    updated_at: string;
  }>;
  brand: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    brewery_id: number;
  };
  brewery: {
    id: number;
    name: string;
    estdate: number;
    created_at: string;
    updated_at: string;
  };
};

function BeerPage() {
  const { beer_id } = useLocalSearchParams();
  const userId = getItem("userId");
  const router = useRouter();

  const [beer, setBeer] = useState<Beer | null>(null);
  const [beerInfo, setBeerInfo] = useState<BeerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getBeer = async () => {
    try {
      const response = await fetchBeer(beer_id);
      setBeerInfo(response);
      setBeer(response.beer);
    } catch (error) {
      setErrorMessage("Error getting this beer");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getBeer();
  }, []);

  return (
    <ScrollView>
      <View style={styles.header}>
        <Button
          type="clear"
          icon={{ name: "arrow-back", color: "black" }}
          onPress={() => {
            router.navigate(`/home/${userId}`);
          }}
        ></Button>
      </View>
      <View style={styles.container}>
        {loading && <Text>Loading...</Text>}
        {errorMessage && <Text>{errorMessage}</Text>}
        {!loading && !errorMessage && beer && userId && beer_id && (
          <>
            <Text style={styles.tilte1}>{beer.name}</Text>
            <Text>{beer.style}</Text>
            <Text>{beer.avg_rating}</Text>
            <Text>{beer.hop}</Text>
            <Text>{beer.yeast}</Text>
            <Text>{beer.malts}</Text>
            <Text>{beer.ibu}</Text>
            <Text>{beer.alcohol}</Text>
            <Text>{beer.blg}</Text>
            <Text style={styles.tilte2}>Find it in</Text>
            {beerInfo?.bars_beer.map((bar) => (
              <Text key={bar.id}>{bar.name}</Text>
            ))}
            {beerInfo?.bars_beer.length === 0 && <Text>No bars found</Text>}
            <Text style={styles.tilte2}>Produced by</Text>
            <Text>{beerInfo?.brewery.name || "No info"}</Text>
            <ReviewList user_id={userId} beer_id={beer_id} />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  tilte1: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tilte2: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
});

export default BeerPage;

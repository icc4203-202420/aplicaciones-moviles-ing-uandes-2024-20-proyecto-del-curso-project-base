import axios from "axios";

export default async function fetchBeerInfo(beerId: string | string[]) {
  const path = process.env.EXPO_PUBLIC_API_URL;
  const url = `${path}/beers/${beerId}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

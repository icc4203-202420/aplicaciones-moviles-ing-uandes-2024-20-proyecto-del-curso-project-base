import axios from "axios";

export default async function fetchReviewsFromBeer(BeerId) {
  const baseURL = process.env.EXPO_PUBLIC_API_URL;

  try {
    const response = await axios.get(`${baseURL}/beers/${BeerId}/reviews`);
    return response.data.reviews;
  } catch (error) {
    throw new Error(error);
  }
}

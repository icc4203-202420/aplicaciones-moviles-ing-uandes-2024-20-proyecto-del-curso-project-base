import axios from "axios";

export default async function fetchReviewsFromUser(userId) {
  const baseURL = process.env.EXPO_PUBLIC_API_URL;

  try {
    const response = await axios.get(`${baseURL}/users/${userId}/reviews`);
    return response.data.reviews;
  } catch (error) {
    throw new Error(error);
  }
}

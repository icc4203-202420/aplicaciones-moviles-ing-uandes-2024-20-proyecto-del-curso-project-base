import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
    Text,
    View,
    Button,
    ActivityIndicator,
    StyleSheet,
    FlatList,
    Alert,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as yup from 'yup';
import { Formik } from 'formik';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '@env';

const api = API_URL;

// Validation Schema for Review Form
const validationSchema = yup.object({
    rating: yup.number().min(1).max(5).required('Rating is required'),
    text: yup
        .string()
        .test('minWords', 'Review must have at least 15 words', (value) => {
            const words = value ? value.trim().split(/\s+/) : [];
            return words.length >= 15;
        })
        .required('Review is required'),
});

// Reviews Reducer
const reviewsReducer = (state, action) => {
    switch (action.type) {
        case 'LOADING_REVIEW':
            return { ...state, loading: true, error: '', reviews: [] };
        case 'SHOW_REVIEW':
            return { ...state, loading: false, reviews: action.payload };
        case 'ADD_REVIEW':
            return { ...state, reviews: [action.payload, ...state.reviews] };
        case 'ERROR_REVIEW':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

// Review Form Component
const ReviewForm = ({ beerId }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userReview, setUserReview] = useState(null);

    const [state, dispatch] = useReducer(reviewsReducer, {
        reviews: [],
        loading: false,
        error: '',
    });

    // Fetch User Info from Secure Store
    const fetchSecureStore = async () => {
        try {
            const userData = await SecureStore.getItemAsync('currentUser');
            const user = JSON.parse(userData);
            setCurrentUser(user);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    useEffect(() => {
        fetchSecureStore();
    }, []);

    // Fetch Reviews for Beer
    const getReviews = async () => {
        dispatch({ type: 'LOADING_REVIEW' });
        try {
            const response = await fetch(`${api}/beers/${beerId}/reviews`);
            const data = await response.json();
            const userReview = data.reviews.find((review) => review.user_id === currentUser?.id);
            setUserReview(userReview);

            const reviews = data.reviews.filter((review) => review.user_id !== currentUser?.id);
            dispatch({ type: 'SHOW_REVIEW', payload: reviews });
        } catch (error) {
            console.error('Error loading reviews:', error);
            dispatch({ type: 'ERROR_REVIEW', payload: 'Error loading reviews' });
        }
    };

    useEffect(() => {
        if (currentUser) {
            getReviews();
        }
    }, [beerId, currentUser]);

    return (
        <View style={styles.containerReviews}>
            {state.loading || !currentUser ? (
                <ActivityIndicator size="large" color="#C58100" />
            ) : (
                <ScrollView>
                    <Formik
                        initialValues={{ rating: 2.5, text: '', beer_id: beerId, user_id: currentUser.id }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            fetch(`${api}/beers/${beerId}/reviews`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ review: values }),
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    dispatch({ type: 'ADD_REVIEW', payload: data.review });
                                    resetForm();
                                })
                                .catch((error) => {
                                    console.error('Error submitting review:', error);
                                    Alert.alert('Error', 'Could not submit your review.');
                                });
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                            <View>
                                <Text style={styles.subTitle}>Submit Your Review</Text>
                                <Text style={styles.ratingLabel}>Rating: {values.rating}</Text>
                                <TextInput
                                    placeholder="Enter rating (1-5)"
                                    keyboardType="numeric"
                                    onChangeText={handleChange('rating')}
                                    onBlur={handleBlur('rating')}
                                    value={String(values.rating)}
                                    style={styles.input}
                                />
                                {errors.rating && <Text style={styles.error}>{errors.rating}</Text>}

                                <TextInput
                                    placeholder="Your review"
                                    onChangeText={handleChange('text')}
                                    onBlur={handleBlur('text')}
                                    value={values.text}
                                    multiline
                                    style={[styles.input, styles.textArea]}
                                />
                                {errors.text && <Text style={styles.error}>{errors.text}</Text>}

                                <Button title="Submit Review" onPress={handleSubmit} />
                            </View>
                        )}
                    </Formik>

                    {userReview && (
                        <View>
                            <Text style={styles.subTitle}>Your Review:</Text>
                            <View style={styles.review}>
                                <Text style={styles.rating}>Rating: {userReview.rating}</Text>
                                <Text>{userReview.text}</Text>
                            </View>
                        </View>
                    )}

                    <Text style={styles.subTitle}>Other Reviews</Text>
                    <FlatList
                        data={state.reviews || []} // Asegura que `data` sea siempre un array válido
                        keyExtractor={(item, index) => item?.id?.toString() || index.toString()} // Fallback al índice si `id` no existe
                        renderItem={({ item }) =>
                            item ? ( // Verifica que `item` no sea undefined
                                <View style={styles.review}>
                                    <Text style={styles.rating}>Rating: {item.rating}</Text>
                                    <Text>{item.text}</Text>
                                </View>
                            ) : null
                        }
                    />
                </ScrollView>
            )}
        </View>
    );
};

// Main Beer Details Component
const ShowBeer = () => {
    const router = useRouter();
    const { beerId } = useLocalSearchParams();

    const [beer, setBeer] = useState(null);
    const [brand, setBrand] = useState(null);
    const [brewery, setBrewery] = useState(null);
    const [bars, setBars] = useState([]);
    const [barsBeers, setBarsBeers] = useState([]);
    const [barsNames, setBarsNames] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const fetchBeerData = async () => {
        try {
            const beerResponse = await fetch(`${api}/beers/${beerId}`);
            const beerData = await beerResponse.json();
            setBeer(beerData.beer);

            const brandResponse = await fetch(`${api}/brands/${beerData.beer.brand_id}`);
            const brandData = await brandResponse.json();
            setBrand(brandData.brand);

            const breweryResponse = await fetch(`${api}/breweries/${brandData.brand.brewery_id}`);
            const breweryData = await breweryResponse.json();
            setBrewery(breweryData.brewery);

            const barsResponse = await fetch(`${api}/bars`);
            const barsData = await barsResponse.json();
            setBars(barsData.bars);

            const barsBeersResponse = await fetch(`${api}/beers/${beerData.beer.id}/bars_beers`);
            const barsBeersData = await barsBeersResponse.json();
            setBarsBeers(barsBeersData.bars_beers);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching beer data:', error);
        }
    };

    useEffect(() => {
        fetchBeerData();
    }, [beerId]);

    useEffect(() => {
        const barIds = barsBeers.map((barBeer) => barBeer.bar_id);
        const filteredBars = bars.filter((bar) => barIds.includes(bar.id));
        setBarsNames(filteredBars.map((bar) => bar.name));
    }, [bars, barsBeers]);

    const goBack = () => {
        router.replace('(tabs)/beers');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#C58100" />
                ) : (
                    <ScrollView>
                        {beer && brand && brewery && (
                            <View style={styles.beerContainer}>
                                <Text style={styles.beerName}>{beer.name}</Text>
                                <Text style={styles.beerDetail}>Type: {beer.beer_type}</Text>
                                <Text style={styles.beerDetail}>Style: {beer.style}</Text>
                                <Text style={styles.beerDetail}>IBU: {beer.ibu}</Text>
                                <Text style={styles.beerDetail}>Alcohol: {beer.alcohol}%</Text>
                                <Text style={styles.beerDetail}>Brewery: {brewery.name}</Text>
                                <Text style={styles.beerDetail}>Avg. Rating: {beer.avg_rating}</Text>
                                <Text style={styles.availableText}>Available at:</Text>
                                <FlatList
                                    data={barsNames}
                                    renderItem={({ item }) => <Text style={styles.barItem}>{item}</Text>}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                        )}
                        <ReviewForm beerId={beerId} />
                    </ScrollView>
                )}
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default ShowBeer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#F1DCA7',
    },
    beerContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    beerName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#C58100',
        marginBottom: 10,
    },
    beerDetail: {
        fontSize: 16,
        color: '#564c3d',
        marginBottom: 5,
    },
    availableText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: '600',
        color: '#C58100',
    },
    barItem: {
        fontSize: 16,
        color: '#C58100',
        marginVertical: 3,
    },
    containerReviews: {
        flex: 1,
        padding: 20,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#C58100',
    },
    input: {
        borderWidth: 1,
        borderColor: '#C58100',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: '#FFF',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    error: {
        color: 'red',
        marginBottom: 5,
    },
    review: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
    },
    rating: {
        fontWeight: 'bold',
    },
    backButton: {
        backgroundColor: '#C58100',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
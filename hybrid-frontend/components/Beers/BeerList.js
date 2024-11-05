import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API_BASE_URL from '../Hooks/fetchAxios';

function BeerList() {
    const [beers, setBeers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        fetchBeers();
    }, []);

    const fetchBeers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/beers`); // Your API endpoint
            console.log(response.data); // Log the entire response
            setBeers(response.data.beers || []); // Update the state with the beers data
        } catch (error) {
            console.error('Error fetching beers:', error);
        }
    };
    

    const filteredBeers = beers.filter(beer =>
        beer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    
    return (
        <ScrollView style={styles.pageContainer}>
            <View style={styles.container}>
                <TextInput
                    placeholder="Busca Cerveza..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    style={styles.input}
                />

                <View style={styles.listContainer}>
                    {/* FlatList para manejar el listado de cervezas */}
                    <FlatList
                        data={filteredBeers}
                        keyExtractor={beer => beer.id.toString()}
                        renderItem={({ item }) => (
                            <Pressable 
                                onPress={() => navigation.navigate('BeerDetails', { beerId: item.id })} 
                                style={styles.beerButton}
                            >
                                <Text style={styles.beerText}>{item.name}</Text>
                            </Pressable>
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                </View>
            </View>
        </ScrollView>
    );
} 

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#f9a825', // Mismo color del login
    },
    container: {
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    input: {
        padding: 10,
        borderBottomWidth: 1,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    listContainer: {
        flex: 1,
    },
    beerButton: {
        backgroundColor: '#FF6600', // Botones en gris
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    beerText: {
        color: '#f0f0f0', // Color del background del login para el texto
        fontSize: 16,
    },
});

export default BeerList;

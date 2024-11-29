import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API_BASE_URL from '../Hooks/fetchAxios';

function BarsList() {
    const [bars, setBars] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        fetchBars();
    }, []);

    const fetchBars = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/bars`); // Your API endpoint
            console.log(response.data); // Log the entire response
            setBars(response.data.bars || []); // Update the state with the beers data
        } catch (error) {
            console.error('Error fetching bars:', error);
        }
    };
    

    const filteredBars = bars.filter(bar =>
        bar.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    
    return (
        <ScrollView style={styles.pageContainer}>
            <View style={styles.container}>
                <TextInput
                    placeholder="Busca Bares..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    style={styles.input}
                />

                <View style={styles.listContainer}>
                    {/* FlatList para manejar el listado de cervezas */}
                    <FlatList
                        data={filteredBars}
                        keyExtractor={bar => bar.id.toString()}
                        renderItem={({ item }) => (
                            <Pressable 
                                onPress={() => navigation.navigate('BarsDetails', { barId: item.id })} 
                                style={styles.barButton}
                            >
                                <Text style={styles.barText}>{item.name}</Text>
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
        backgroundColor: '#f0f0f0', // Mismo color del login
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
    barButton: {
        backgroundColor: '#ccc', // Botones en gris
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    barText: {
        color: '#f0f0f0', // Color del background del login para el texto
        fontSize: 16,
    },
});

export default BarsList;
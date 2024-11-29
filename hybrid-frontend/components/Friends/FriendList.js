import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";

export default function SearchFriendList({ searchTerm, friends, handleAddFriend }) {
    // Filtra amigos según el término de búsqueda
    const filteredFriends = friends.filter(friend =>
        friend.handle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredFriends}
                keyExtractor={(friend) => friend.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.friendItem}>
                        <Text style={styles.friendText}>{item.first_name} {item.last_name} (@{item.handle})</Text>
                        <Pressable
                            onPress={() => handleAddFriend(item.id)}
                            style={styles.addButton}
                        >
                            <Text style={styles.addButtonText}>Agregar</Text>
                        </Pressable>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 20,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    friendText: {
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#f9a825',
        padding: 8,
        borderRadius: 5,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button } from "react-native-elements";
import axios from "axios";
import { getItem, deleteItem } from "../../util/Storage";
import userService from "../../services/user";

const palette = {
  background: "#210F04",
  components: "#452103",
  amber: "#690500",
  sinfiltrar: "#934B00",
  lager: "#BB6B00",
  clear: "#FFC107",
};

const Home = () => {
  const { user_id } = useLocalSearchParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogOut = async () => {
    try {
      await deleteItem("userId");
      await deleteItem("imageUrl");
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  useEffect(() => {
    const initData = async () => {
      try {
        const response = await userService(user_id);
        setUserData(response.data);
      } catch (error: any) {
        if (error.response) {
          await deleteItem("userId");
          router.push("/");
          setErrorMessage("Error al obtener los datos del usuario");
        } else {
          setErrorMessage("Error de conexión");
        }
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [user_id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoutContainer}>
        <Button title="Log Out" onPress={handleLogOut} buttonStyle={styles.logoutButton} />
      </View>

      <Text style={styles.welcomeText}>Welcome {userData?.name}!</Text>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>News from Friends</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 90,
    marginBottom: 30,
    color: "#fff",
    
  },
  sectionContainer: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  logoutContainer: {
    position: "absolute",
    top: 20,
    right: 20, 
  },
  logoutButton: {
    backgroundColor: palette.lager,
    paddingHorizontal: 10, 
    paddingVertical: 5, 
  },
});

export default Home;

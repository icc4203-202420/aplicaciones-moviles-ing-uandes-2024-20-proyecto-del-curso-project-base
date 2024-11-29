import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => <FontAwesome name="home" size={24} color="black" />
        }}
      />
      <Tabs.Screen
        name="beers"
        options={{
          title: 'Beers',
          tabBarIcon: () => <FontAwesome name="beer" size={24} color="black" />
        }}
      />
      <Tabs.Screen
        name="bars"
        options={{
          title: 'Bars',
          tabBarIcon: () => <FontAwesome name="map-marker" size={24} color="black" />
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: () => <FontAwesome name="calendar" size={24} color="black" />
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: () => <FontAwesome name="users" size={24} color="black" />
        }}
      />
    </Tabs>
  );
}

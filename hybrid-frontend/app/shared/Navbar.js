// app/shared/Navbar.js
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { HomeScreen } from '../home/index';
// import { UsersScreen } from '../users/index';
// import { BeersScreen } from '../beers/index';
// import { BarsScreen } from '../bars/index';
// import { EventsScreen } from '../events/index';
// import { Icon } from '@rneui/themed'; // Si estás usando RNE para íconos

// const Tab = createBottomTabNavigator();

// const Navbar = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === 'Home') {
//             iconName = 'home';
//           } else if (route.name === 'Users') {
//             iconName = 'people';
//           } else if (route.name === 'Beers') {
//             iconName = 'beer';
//           } else if (route.name === 'Bars') {
//             iconName = 'local-bar';
//           } else if (route.name === 'Events') {
//             iconName = 'event';
//           }

//           // Puedes retornar cualquier componente que quieras aquí!
//           return <Icon name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: 'tomato',
//         tabBarInactiveTintColor: 'gray',
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Users" component={UsersScreen} />
//       <Tab.Screen name="Beers" component={BeersScreen} />
//       <Tab.Screen name="Bars" component={BarsScreen} />
//       <Tab.Screen name="Events" component={EventsScreen} />
//     </Tab.Navigator>
//   );
// };

// export default Navbar;

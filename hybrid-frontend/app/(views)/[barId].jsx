// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// import axiosInstance from '../api/axios';
// import { useNavigation, useRoute } from '@react-navigation/native';

// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   const day = date.toLocaleDateString('en-US', { day: 'numeric' });
//   const month = date.toLocaleDateString('en-US', { month: 'short' });
//   return { day, month };
// };

// function ShowBar() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { id } = route.params;

//   const [bar, setBar] = useState({});
//   const [events, setEvents] = useState([]);
//   const [attendances, setAttendances] = useState([]);
//   const user = JSON.parse(localStorage.getItem('Tapp/Session/currentUser'));

//   useEffect(() => {
//     axiosInstance.get(`/bars/${id}`)
//       .then((res) => {
//         setBar(res.data.bar);
//       })
//       .catch((error) => {
//         console.error('Error loading bar data:', error);
//       });
//   }, [id]);

//   useEffect(() => {
//     axiosInstance.get(`/bars/${id}/events`)
//       .then((res) => {
//         setEvents(res.data.events);
//       })
//       .catch((error) => {
//         console.error('Error loading events data:', error);
//       });
//   }, [id]);

//   useEffect(() => {
//     axiosInstance.get(`/users/${user.id}/attendances`)
//       .then((res) => {
//         setAttendances(res.data.attendances.map((attendance) => attendance.event_id));
//       })
//       .catch((error) => {
//         console.error('Error loading attendances data:', error);
//       });
//   }, [user]);

//   const handleAssistance = (id) => {
//     const data = {
//       user_id: user.id,
//       event_id: id,
//       checked_in: true
//     };
//     axiosInstance.post(`/events/${id}/attendances`, data)
//       .then(() => {
//         setAttendances([...attendances, id]);
//       })
//       .catch((error) => {
//         console.error('Error checking in:', error);
//       });
//   };

//   const isAttending = (id) => attendances.includes(id);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.barName}>{bar.name}</Text>
//       <Text style={styles.eventsHeader}>Events:</Text>
      
//       {events.length > 0 ? (
//         <FlatList
//           data={events}
//           keyExtractor={(event) => event.id.toString()}
//           renderItem={({ item: event }) => {
//             const { day, month } = formatDate(event.date);
//             return (
//               <View style={styles.eventItem} key={event.id}>
//                 <View style={styles.eventContainer}>
//                   <View style={styles.eventFields}>
//                     <Text style={styles.eventName}>{event.name}</Text>
//                     <Text style={styles.eventDesc}>{event.description}</Text>
//                   </View>
//                   <View style={styles.eventDate}>
//                     <Text style={styles.eventDay}>{day}</Text>
//                     <Text style={styles.eventMonth}>{month}</Text>
//                   </View>
//                 </View>
//                 <View style={styles.eventButtonsContainer}>
//                   <TouchableOpacity
//                     style={[
//                       styles.checkInButton,
//                       { backgroundColor: isAttending(event.id) ? '#93DC5C' : '#FF5C5C' }
//                     ]}
//                     onPress={() => handleAssistance(event.id)}
//                   >
//                     <Text style={styles.buttonText}>
//                       {isAttending(event.id) ? 'Attending' : 'Check in'}
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.redirectButton}
//                     onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
//                   >
//                     <Text style={styles.redirectButtonText}>Take a look</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             );
//           }}
//         />
//       ) : (
//         <ActivityIndicator size="large" color="#C58100" />
//       )}
//     </View>
//   );
// }

// export default ShowBar;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff'
//   },
//   barName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   eventsHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   eventItem: {
//     marginBottom: 15,
//     padding: 10,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 5,
//   },
//   eventContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   eventFields: {
//     flex: 1,
//   },
//   eventName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   eventDesc: {
//     fontSize: 14,
//     color: '#555',
//   },
//   eventDate: {
//     alignItems: 'center',
//   },
//   eventDay: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   eventMonth: {
//     fontSize: 14,
//     color: '#888',
//   },
//   eventButtonsContainer: {
//     flexDirection: 'row',
//     marginTop: 10,
//     justifyContent: 'space-between',
//   },
//   checkInButton: {
//     padding: 10,
//     borderRadius: 5,
//   },
//   redirectButton: {
//     padding: 10,
//     backgroundColor: '#007bff',
//     borderRadius: 5,
//     marginLeft: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   redirectButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });


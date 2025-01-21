// FlightCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FlightCard = ({ flight }: { flight: any }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.header}>{flight.airline}</Text>
            <Text>Flight Number: {flight.flightNumber}</Text>
            <Text>Origin: {flight.origin}</Text>
            <Text>Destination: {flight.destination}</Text>
            <Text>Departure Time: {flight.departureTime}</Text>
            <Text>Arrival Time: {flight.arrivalTime}</Text>
            <Text>Duration: {flight.duration}</Text>
            <Text>Price: ${flight.price}</Text>
            <Text>Seats Available: {flight.seatsAvailable}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
});

export default FlightCard;

"use client";
import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentModal from './PaymentModal';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Helper function to format date and time
const formatDateTime = (dateTimeString: any) => {
  const date = new Date(dateTimeString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

// Helper function to format duration
const formatDuration = (minutes: any) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Normalize flight data from both APIs
const normalizeFlightData = (flight: any, source: any) => {
  if (source === 'amadeus') {
    // Amadeus API data structure
    return {
      id: flight.id,
      price: parseFloat(flight.price.total),
      currency: flight.price.currency,
      segments: flight.itineraries[0].segments.map((segment: any) => ({
        departure: {
          airport: segment.departure.iataCode,
          time: formatDateTime(segment.departure.at)
        },
        arrival: {
          airport: segment.arrival.iataCode,
          time: formatDateTime(segment.arrival.at)
        },
        duration: formatDuration(segment.duration),
        airline: segment.carrierCode,
        flightNumber: segment.number
      })),
      totalDuration: formatDuration(flight.itineraries[0].duration)
    };
  } else {
    // SerpApi (Google Flights) data structure
    return {
      id: `serp-${flight.departure_token}`,
      price: flight.price,
      currency: 'AED', // SerpApi seems to always return prices in AED
      segments: flight.flights.map((segment:any) => ({
        departure: {
          airport: segment.departure_airport.id,
          time: formatDateTime(segment.departure_airport.time)
        },
        arrival: {
          airport: segment.arrival_airport.id,
          time: formatDateTime(segment.arrival_airport.time)
        },
        duration: formatDuration(segment.duration),
        airline: segment.airline,
        flightNumber: segment.flight_number
      })),
      totalDuration: formatDuration(flight.total_duration)
    };
  }
};

const FlightCard = ({ flight, onSelect }: any) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <span className="text-lg text-red-500">{flight.price} {flight.currency}</span>
        </div>
      </CardHeader>
      <CardContent>
        {flight.segments.map((segment: any, index: number) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{segment.departure.airport} → {segment.arrival.airport}</p>
                <p className="text-sm text-gray-600">{segment.departure.time} - {segment.arrival.time}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{segment.airline} {segment.flightNumber}</p>
                <p className="text-sm text-gray-600">Duration: {segment.duration}</p>
              </div>
            </div>
            {index < flight.segments.length - 1 && <hr className="my-2" />}
          </div>
        ))}
      </CardContent>
      <CardFooter className="bg-gray-50 flex justify-between items-center">
        <p className="text-sm text-gray-600">Total duration: {flight.totalDuration}</p>
        <Button variant="outline" size="sm" onClick={() => onSelect(flight)}>Select</Button>
      </CardFooter>
    </Card>
  );
  
  const FlightSearchList = ({ flights, source }: any) => {
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [sortBy, setSortBy] = useState('price'); // Default sort by price
  
    const normalizedFlights = useMemo(() => 
      flights.map((flight: any) => normalizeFlightData(flight, source)),
      [flights, source]
    );
  
    const sortedFlights = useMemo(() => {
      return [...normalizedFlights].sort((a, b) => {
        switch (sortBy) {
          case 'price':
            return a.price - b.price;
          case 'duration':
            return parseInt(a.totalDuration) - parseInt(b.totalDuration);
          case 'departureTime':
            return new Date(a.segments[0].departure.time).getTime() - new Date(b.segments[0].departure.time).getTime();
          default:
            return 0;
        }
      });
    }, [normalizedFlights, sortBy]);
  
    const handleFlightSelect = (flight: any) => {
      setSelectedFlight(flight);
    };
  
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          {/* <h2 className="text-2xl font-bold">Flight Search Results</h2> */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Sort by Price</SelectItem>
              <SelectItem value="duration">Sort by Duration</SelectItem>
              <SelectItem value="departureTime">Sort by Departure Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {sortedFlights.map((flight: any) => (
          <FlightCard key={flight.id} flight={flight} onSelect={handleFlightSelect} />
        ))}
        {selectedFlight && (
          <PaymentModal
            flight={selectedFlight}
            onClose={() => setSelectedFlight(null)}
          />
        )}
      </div>
    );
  };
  
  export default FlightSearchList;
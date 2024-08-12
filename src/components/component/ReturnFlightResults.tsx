import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime, formatDuration } from './SearchForm';

interface ReturnFlight {
  price: number;
  airline: string;
  flights: {
    flight_number: string;
    departure_airport: {
      name: string;
      id: string;
      time: string;
    };
    arrival_airport: {
      name: string;
      id: string;
      time: string;
    };
    travel_class: string;
  }[];
  total_duration: string;
  layovers?: {
    duration: string;
    name: string;
  }[];
}

interface ReturnFlightResultsProps {
  returnFlightData: {
    data: {
      best_flights: ReturnFlight[];
      other_flights: ReturnFlight[];
    };
  };
  onSelectReturnFlight: (flight: ReturnFlight) => void;
}

const ReturnFlightResults: React.FC<ReturnFlightResultsProps> = ({ returnFlightData, onSelectReturnFlight }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFlightIndex, setSelectedFlightIndex] = useState<number | null>(null);

  const bestFlights = returnFlightData?.data?.best_flights || [];
  const otherFlights = returnFlightData?.data?.other_flights || [];

  const handleSelectFlight = (flight: ReturnFlight, index: number) => {
    setSelectedFlightIndex(index);
    onSelectReturnFlight(flight);
  };

  const formatFlightDetails = (flight: ReturnFlight, index: number) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{flight.price} AED</span>
        <span>{flight.airline} - Flight {flight.flights[0].flight_number}</span>
      </div>
      <p>{flight.flights[0].departure_airport.name} ({flight.flights[0].departure_airport.id}) → {flight.flights[0].arrival_airport.name} ({flight.flights[0].arrival_airport.id})</p>
      <p>Departure: {formatDateTime(flight.flights[0].departure_airport.time)}</p>
      <p>Arrival: {formatDateTime(flight.flights[0].arrival_airport.time)}</p>
      <p>Duration: {formatDuration(flight.total_duration)}</p>
      <p>Class: {flight.flights[0].travel_class}</p>
      {flight.layovers && flight.layovers.length > 0 && (
        <p>Layovers: {flight.layovers.map((layover) => `${formatDuration(layover.duration)} in ${layover.name}`).join(', ')}</p>
      )}
      <Button 
        onClick={() => handleSelectFlight(flight, index)} 
        variant={selectedFlightIndex === index ? "default" : "outline"}
        className="mt-2"
      >
        {selectedFlightIndex === index ? "Selected" : "Select"}
      </Button>
    </div>
  );

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Return Flight Options:</h3>
      {bestFlights.map((flight, index) => (
        <Card key={index} className="mb-4">
          <CardContent>
            {formatFlightDetails(flight, index)}
          </CardContent>
        </Card>
      ))}
      {otherFlights.length > 0 && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline">
              {isOpen ? 'Hide' : 'Show'} Other Return Flight Options ({otherFlights.length})
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {otherFlights.map((flight, index) => (
              <Card key={index} className="mt-2">
                <CardContent>
                  {formatFlightDetails(flight, bestFlights.length + index)}
                </CardContent>
              </Card>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default ReturnFlightResults;
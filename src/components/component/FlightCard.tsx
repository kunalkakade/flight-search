import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Import the Loader2 icon
import { API_BASE_URL, formatDuration } from "./SearchForm";
import ReturnFlightResults from "./ReturnFlightResults";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process?.env?.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface Flight {
  id: string;
  price: number;
  currency: string;
  segments: any[][];
  totalDuration: string[];
  travelClass: string;
  source: string;
  departure_token?: string;
  layovers?: any[];
}

interface ReturnFlight {
  price: number;
  flights: {
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
  }[];
  total_duration: string;
}

interface FlightCardProps {
  flight: Flight;
  searchQuery: any;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, searchQuery }) => {
  const [showReturnFlights, setShowReturnFlights] = useState(false);
  const [returnFlightData, setReturnFlightData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<ReturnFlight | null>(null);

  const handleSearchReturnFlights = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/serp-return-flight-search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...searchQuery,
            departureToken: flight.departure_token,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setReturnFlightData(data);
      setShowReturnFlights(true);
    } catch (error) {
      console.error("Error fetching return flights:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async () => {
    setBookingLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flight, returnFlight: selectedReturnFlight }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Error redirecting to checkout:', error);
        // Optionally, show an error message to the user here
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Optionally, show an error message to the user here
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSelectReturnFlight = (returnFlight: ReturnFlight) => {
    setSelectedReturnFlight(returnFlight);
  };

  const totalDuration = selectedReturnFlight
    ? `${flight.totalDuration[0]} + ${formatDuration(selectedReturnFlight.total_duration)}`
    : flight.departure_token
    ? `${flight.totalDuration[0]} (outbound)`
    : flight.totalDuration.join(" + ");

  const isBookingEnabled = !flight.departure_token || (flight.departure_token && selectedReturnFlight);

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <span className="text-lg text-red-500">
            {flight.price} {flight.currency}
            {selectedReturnFlight && ` + ${selectedReturnFlight.price} AED`}
          </span>
          <span className="text-sm text-gray-500">{flight.source}</span>
        </div>
      </CardHeader>
      <CardContent>
        {flight.segments.map((segment: any[], index: number) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold mb-2">
              {index === 0 ? "Outbound" : "Return"}
            </h3>
            {segment.map((leg: any, legIndex: number) => (
              <div key={legIndex} className="mb-2">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">
                      {leg.departure.airport} → {leg.arrival.airport}
                    </p>
                    <p className="text-sm text-gray-600">
                      {leg.departure.time} - {leg.arrival.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {leg.airlineName} ({leg.airlineCode}) {leg.flightNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Duration: {leg.duration}
                    </p>
                  </div>
                </div>
                {legIndex < segment.length - 1 && (
                  <div className="my-2 text-sm text-gray-600">
                    Layover:{" "}
                    {formatDuration(flight?.layovers?.[legIndex]?.duration)} in{" "}
                    {flight?.layovers?.[legIndex]?.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        {selectedReturnFlight && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Selected Return Flight</h3>
            <p>{selectedReturnFlight.flights[0].departure_airport.name} ({selectedReturnFlight.flights[0].departure_airport.id}) → {selectedReturnFlight.flights[0].arrival_airport.name} ({selectedReturnFlight.flights[0].arrival_airport.id})</p>
            <p>Departure: {selectedReturnFlight.flights[0].departure_airport.time}</p>
            <p>Arrival: {selectedReturnFlight.flights[0].arrival_airport.time}</p>
            <p>Duration: {formatDuration(selectedReturnFlight.total_duration)}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            Total duration: {totalDuration}
          </p>
          <p className="text-sm text-gray-600">Class: {flight.travelClass}</p>
        </div>
        <div className="flex space-x-2">
          {flight.source === "serp" && flight.departure_token && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSearchReturnFlights}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search Return Flights"}
            </Button>
          )}
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(flight)}
          >
            Select
          </Button> */}
          <Button
            variant="default"
            size="sm"
            onClick={handleBookNow}
            disabled={!isBookingEnabled || bookingLoading}
          >
            {bookingLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              "Book Now"
            )}
          </Button>
        </div>
      </CardFooter>
      {showReturnFlights && returnFlightData && (
        <ReturnFlightResults 
          returnFlightData={returnFlightData} 
          onSelectReturnFlight={handleSelectReturnFlight}
        />
      )}
    </Card>
  );
};

export default FlightCard;
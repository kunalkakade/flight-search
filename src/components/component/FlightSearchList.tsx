"use client";
import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentModal from './PaymentModal';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Helper function to format date and time
const formatDateTime = (dateTimeString: string) => {
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
const formatDuration = (minutes: number | string) => {
    if(!minutes){
        return `no min data found`;
    }
  if (typeof minutes === 'string') {
    const matches = minutes.match(/PT(\d+H)?(\d+M)?/);
    if (!matches) return '';
    const hours = matches[1] ? parseInt(matches[1]) : 0;
    const mins = matches[2] ? parseInt(matches[2]) : 0;
    return `${hours}h ${mins}m`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
};

// Normalize flight data from both APIs
const normalizeFlightData = (flight: any, source: 'amadeus' | 'serp') => {
  if (source === 'amadeus') {
    return {
      id: flight.id,
      price: parseFloat(flight.price.total),
      travelClass: flight.travelerPricings[0].fareDetailsBySegment[0].cabin.toLowerCase(),
      currency: flight.price.currency,
      segments: flight.itineraries.map((itinerary: any) => 
        itinerary.segments.map((segment: any) => ({
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
        }))
      ),
      totalDuration: flight.itineraries.map((itinerary: any) => formatDuration(itinerary.duration)),
      source: 'amadeus'
    };
  } else {
    return {
      id: `serp-${flight.departure_token}`,
      price: flight.price,
      currency: 'AED',
      segments: [flight.flights.map((segment: any) => ({
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
      }))],
      totalDuration: [formatDuration(flight.total_duration)],
      travelClass: flight.flights[0].travel_class.toLowerCase(),
      source: 'serp',
      layovers: flight.layovers
    };
  }
};

const FlightCard = ({ flight, onSelect }: any) => (
  <Card className="mb-4">
    <CardHeader>
      <div className="flex justify-between items-center">
        <span className="text-lg text-red-500">{flight.price} {flight.currency}</span>
        <span className="text-sm text-gray-500">{flight.source}</span>
      </div>
    </CardHeader>
    <CardContent>
      {flight.segments.map((segment: any[], index: number) => (
        <div key={index} className="mb-4">
          <h3 className="font-semibold mb-2">{index === 0 ? "Outbound" : "Return"}</h3>
          {segment.map((leg: any, legIndex: number) => (
            <div key={legIndex} className="mb-2">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{leg.departure.airport} → {leg.arrival.airport}</p>
                  <p className="text-sm text-gray-600">{leg.departure.time} - {leg.arrival.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{leg.airline} {leg.flightNumber}</p>
                  <p className="text-sm text-gray-600">Duration: {leg.duration}</p>
                </div>
              </div>
              {legIndex < segment.length - 1 && (
                <div className="my-2 text-sm text-gray-600">
                  Layover: {formatDuration(flight?.layovers?.[legIndex]?.duration)} in {flight?.layovers?.[legIndex]?.name}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </CardContent>
    <CardFooter className="bg-gray-50 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-600">Total duration: {flight.totalDuration.join(' + ')}</p>
        <p className="text-sm text-gray-600">Class: {flight.travelClass}</p>
      </div>
      <Button variant="outline" size="sm" onClick={() => onSelect(flight)}>Select</Button>
    </CardFooter>
  </Card>
);

const FlightSearchList = ({ amadeusFlights, serpFlights }: any) => {
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [sortBy, setSortBy] = useState('price');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [maxStops, setMaxStops] = useState<number | null>(null);
    const itemsPerPage = 10;
  
    const normalizedFlights = useMemo(() => {
      const amadeus = amadeusFlights.map((flight: any) => normalizeFlightData(flight, 'amadeus'));
      const serp = serpFlights.map((flight: any) => normalizeFlightData(flight, 'serp'));
      return [...amadeus, ...serp];
    }, [amadeusFlights, serpFlights]);
  
    const uniqueFlights = useMemo(() => {
      const flightMap = new Map();
      normalizedFlights.forEach(flight => {
        const key = `${flight.segments[0][0].departure.airport}-${flight.segments[0][0].arrival.airport}-${flight.segments[0][0].flightNumber}`;
        if (!flightMap.has(key) || flight.price < flightMap.get(key).price) {
          flightMap.set(key, flight);
        }
      });
      return Array.from(flightMap.values());
    }, [normalizedFlights]);
  
    const availableClasses = useMemo(() => {
      const classes = new Set(uniqueFlights.map(flight => flight.travelClass));
      return Array.from(classes);
    }, [uniqueFlights]);
  
    const filteredFlights = useMemo(() => {
      return uniqueFlights.filter(flight => {
        const classMatch = selectedClasses.length === 0 || selectedClasses.includes(flight.travelClass);
        const stopsMatch = maxStops === null || flight.segments[0].length - 1 <= maxStops;
        return classMatch && stopsMatch;
      });
    }, [uniqueFlights, selectedClasses, maxStops]);
  
    const sortedFlights = useMemo(() => {
      return [...filteredFlights].sort((a, b) => {
        switch (sortBy) {
          case 'price':
            return a.price - b.price;
          case 'duration':
            return a.totalDuration[0].localeCompare(b.totalDuration[0]);
          case 'departureTime':
            return a.segments[0][0].departure.time.localeCompare(b.segments[0][0].departure.time);
          default:
            return 0;
        }
      });
    }, [filteredFlights, sortBy]);
  
    const paginatedFlights = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return sortedFlights.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedFlights, currentPage]);
  
    const handleFlightSelect = (flight: any) => {
      setSelectedFlight(flight);
    };
  
    const totalPages = Math.ceil(sortedFlights.length / itemsPerPage);
  
    const handleClassChange = (className: string) => {
      setSelectedClasses(prev =>
        prev.includes(className)
          ? prev.filter(c => c !== className)
          : [...prev, className]
      );
      setCurrentPage(1);
    };
  
    const handleMaxStopsChange = (value: string) => {
      setMaxStops(value === 'any' ? null : parseInt(value));
      setCurrentPage(1);
    };
  
  
    return (
        <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Filters</h3>
          <div className="flex flex-wrap gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Travel Class</h4>
              {availableClasses.map(className => (
                <div key={className} className="flex items-center">
                  <Checkbox
                    id={`class-${className}`}
                    checked={selectedClasses.includes(className)}
                    onCheckedChange={() => handleClassChange(className)}
                  />
                  <Label htmlFor={`class-${className}`} className="ml-2 capitalize">
                    {className.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
            {/* <div>
              <h4 className="text-sm font-medium mb-1">Max Stops</h4>
              <Select value={maxStops === null ? 'any' : maxStops.toString()} onValueChange={handleMaxStopsChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Any number of stops" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any number of stops</SelectItem>
                  <SelectItem value="0">Non-stop only</SelectItem>
                  <SelectItem value="1">1 stop or fewer</SelectItem>
                  <SelectItem value="2">2 stops or fewer</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
           </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span>Total flights: {sortedFlights.length}</span>
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
      {paginatedFlights.map((flight: any) => (
        <FlightCard key={flight.id} flight={flight} onSelect={handleFlightSelect} />
      ))}
      {selectedFlight && (
        <PaymentModal
          flight={selectedFlight}
          onClose={() => setSelectedFlight(null)}
        />
      )}
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default FlightSearchList;
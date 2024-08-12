"use client";
import React, { useMemo, useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { airlineCodeToName } from '@/lib/airlineCodeToName';
import { formatDuration, formatDateTime } from './SearchForm';
import FlightCard from './FlightCard';
import PaymentModal from './PaymentModal';

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
            airlineCode: segment.carrierCode,
            airlineName: airlineCodeToName[segment.carrierCode] || segment.carrierCode,
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
          airlineCode: segment.airline,
          airlineName: airlineCodeToName[segment.airline] || segment.airline,
          flightNumber: segment.flight_number
        }))],
        totalDuration: [formatDuration(flight.total_duration)],
        travelClass: flight.flights[0].travel_class.toLowerCase(),
        source: 'serp',
        departure_token: flight.departure_token,
        layovers: flight.layovers
      };
    }
  };

const FlightSearchList = ({ amadeusFlights, serpFlights, searchQuery }: any) => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState('all');
  const [directFlightsOnly, setDirectFlightsOnly] = useState(false);
  const itemsPerPage = 10;

  const normalizedFlights = useMemo(() => {
    const amadeus = amadeusFlights.map((flight: any) => normalizeFlightData(flight, 'amadeus'));
    const serp = serpFlights.map((flight: any) => normalizeFlightData(flight, 'serp'));
    return [...amadeus, ...serp];
  }, [amadeusFlights, serpFlights]);

  const filteredFlights = useMemo(() => {
    return normalizedFlights.filter(flight => {
      const classMatch = selectedClasses.length === 0 || selectedClasses.includes(flight.travelClass);
      const sourceMatch = dataSource === 'all' || flight.source === dataSource;
      const directMatch = !directFlightsOnly || flight.segments[0].length === 1;
      return classMatch && sourceMatch && directMatch;
    });
  }, [normalizedFlights, selectedClasses, dataSource, directFlightsOnly]);

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

  const totalPages = Math.ceil(sortedFlights.length / itemsPerPage);

  const handleClassChange = (className: string) => {
    setSelectedClasses(prev =>
      prev.includes(className)
        ? prev.filter(c => c !== className)
        : [...prev, className]
    );
    setCurrentPage(1);
  };

  const handleDataSourceChange = (value: string) => {
    setDataSource(value);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Filters</h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Travel Class</h4>
            {['economy', 'business', 'first'].map(className => (
              <div key={className} className="flex items-center">
                <Checkbox
                  id={`class-${className}`}
                  checked={selectedClasses.includes(className)}
                  onCheckedChange={() => handleClassChange(className)}
                />
                <Label htmlFor={`class-${className}`} className="ml-2 capitalize">
                  {className}
                </Label>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Data Source</h4>
            <RadioGroup defaultValue="all" onValueChange={handleDataSourceChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Sources</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amadeus" id="amadeus" />
                <Label htmlFor="amadeus">Amadeus</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="serp" id="serp" />
                <Label htmlFor="serp">Google Flights</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Direct Flights Only</h4>
            <Checkbox
              id="direct-flights"
              checked={directFlightsOnly}
              onCheckedChange={(checked) => setDirectFlightsOnly(checked as boolean)}
            />
            <Label htmlFor="direct-flights" className="ml-2">
              Show only direct flights
            </Label>
          </div>
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
        <FlightCard key={flight.id} flight={flight} onSelect={setSelectedFlight} searchQuery={searchQuery} />
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
"use client";
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { JSX, SVGProps } from "react"

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};

const formatDuration = (duration: string) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 'Invalid duration';
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  
  if (hours === 0 && minutes === 0) return 'Invalid duration';
  
  let result = '';
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m`;
  return result.trim();
};

export function Component() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState("1");
  const [flights, setFlights] = useState({ data: [], fromCache: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [airline, setAirline] = useState("all");
  const [departureTime, setDepartureTime] = useState("any");
  const [arrivalTime, setArrivalTime] = useState("any");
  const [stops, setStops] = useState("any");
  
  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [fromOptions, setFromOptions] = useState([]);
  const [toOptions, setToOptions] = useState([]);

  useEffect(() => {
    fetchAirports();
    fetchAirlines();
  }, []);

  const fetchAirports = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/airports`);
      if (!response.ok) {
        throw new Error('Failed to fetch airports');
      }
      const data = await response.json();
      setAirports(data);
    } catch (error) {
      console.error('Error fetching airports:', error);
    }
  };

  const fetchAirlines = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/airlines`);
      const data = await response.json();
      setAirlines(data);
    } catch (error) {
      console.error('Error fetching airlines:', error);
    }
  };

  const searchAirports = async (keyword: string) => {
    if (keyword.length < 2) return [];

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search-airports?keyword=${encodeURIComponent(keyword)}`);
      if (!response.ok) {
        throw new Error('Failed to search airports');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching airports:', error);
      return [];
    }
  };

  const handleFromSearch = async (value: string) => {
    setFrom(value);
    if (value.length >= 2) {
      const options = await searchAirports(value);
      setFromOptions(options);
    } else {
      setFromOptions([]);
    }
  };

  const handleToSearch = async (value: string) => {
    setTo(value);
    if (value.length >= 2) {
      const options = await searchAirports(value);
      setToOptions(options);
    } else {
      setToOptions([]);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/search-flights`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            originCode: from,
            destinationCode: to,
            departureDate: departureDate?.toISOString().split("T")[0],
            returnDate: returnDate?.toISOString().split("T")[0],
            adults: passengers,
            airline,
            departureTime,
            arrivalTime,
            stops,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch flights");
      }

      const data = await response.json();
      setFlights(data);
    } catch (err) {
      setError(
        "An error occurred while searching for flights. Please try again."
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Find your flight</h2>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                  From
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Input
                      id="from"
                      placeholder="Enter departure location"
                      value={from}
                      onChange={(e) => handleFromSearch(e.target.value)}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <Command>
                      <CommandInput placeholder="Search airports..." />
                      <CommandEmpty>No airports found.</CommandEmpty>
                      <CommandGroup>
                        {fromOptions.map((airport: any) => (
                          <CommandItem
                            key={airport.iataCode}
                            onSelect={() => {
                              setFrom(airport.iataCode);
                              setFromOptions([]);
                            }}
                          >
                            {airport.name} ({airport.iataCode})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                  To
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Input
                      id="to"
                      placeholder="Enter arrival location"
                      value={to}
                      onChange={(e) => handleToSearch(e.target.value)}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <Command>
                      <CommandInput placeholder="Search airports..." />
                      <CommandEmpty>No airports found.</CommandEmpty>
                      <CommandGroup>
                        {toOptions.map((airport: any) => (
                          <CommandItem
                            key={airport.iataCode}
                            onSelect={() => {
                              setTo(airport.iataCode);
                              setToOptions([]);
                            }}
                          >
                            {airport.name} ({airport.iataCode})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label htmlFor="departure-date" className="block text-sm font-medium text-gray-700">
                  Departure Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="departure-date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                      {departureDate ? departureDate.toDateString() : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={departureDate}
                      onSelect={setDepartureDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label htmlFor="return-date" className="block text-sm font-medium text-gray-700">
                  Return Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="return-date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                      {returnDate ? returnDate.toDateString() : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label htmlFor="passengers" className="block text-sm font-medium text-gray-700">
                  Passengers
                </label>
                <Select value={passengers} onValueChange={setPassengers}>
                  <SelectTrigger id="passengers">
                    <SelectValue placeholder="1 passenger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 passenger</SelectItem>
                    <SelectItem value="2">2 passengers</SelectItem>
                    <SelectItem value="3">3 passengers</SelectItem>
                    <SelectItem value="4">4 passengers</SelectItem>
                    <SelectItem value="5">5 passengers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1 md:col-span-2">
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? "Searching..." : "Search Flights"}
                </Button>
              </div>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">Filters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="airline" className="block text-sm font-medium text-gray-700">
                  Airline
                </label>
                <Select value={airline} onValueChange={setAirline}>
                  <SelectTrigger id="airline">
                    <SelectValue placeholder="All airlines" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All airlines</SelectItem>
                    {airlines?.map((airline: any) => (
                      <SelectItem key={airline.iataCode} value={airline.iataCode}>
                        {airline.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="departure-time" className="block text-sm font-medium text-gray-700">
                  Departure Time
                </label>
                <Select value={departureTime} onValueChange={setDepartureTime}>
                  <SelectTrigger id="departure-time">
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="morning">Morning (6am - 12pm)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12pm - 6pm)</SelectItem>
                    <SelectItem value="evening">Evening (6pm - 12am)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="arrival-time" className="block text-sm font-medium text-gray-700">
                  Arrival Time
                </label>
                <Select value={arrivalTime} onValueChange={setArrivalTime}>
                  <SelectTrigger id="arrival-time">
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="morning">Morning (6am - 12pm)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12pm - 6pm)</SelectItem>
                    <SelectItem value="evening">Evening (6pm - 12am)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="stops" className="block text-sm font-medium text-gray-700">
                  Stops
                </label>
                <Select value={stops} onValueChange={setStops}>
                  <SelectTrigger id="stops">
                    <SelectValue placeholder="Any stops" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any stops</SelectItem>
                    <SelectItem value="nonstop">Nonstop</SelectItem>
                    <SelectItem value="1stop">1 stop</SelectItem>
                    <SelectItem value="2stops">2 stops</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">Flight Results</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {flights?.data?.length > 0 ? (
              <div className="space-y-6">
                {flights.data.map((flight: any, index: number) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>Flight #{flight.id}</span>
                        <span className="text-lg font-normal">
                          {flight.price.total} {flight.price.currency}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {flight.itineraries[0].segments.map(
                        (segment: any, segmentIndex: number) => (
                          <div key={segmentIndex} className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <p className="font-semibold">
                                  {segment.departure.iataCode} →{" "}
                                  {segment.arrival.iataCode}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {formatDate(segment.departure.at)} -{" "}
                                  {formatDate(segment.arrival.at)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  {segment.carrierCode} {segment.number}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Duration: {formatDuration(segment.duration)}
                                </p>
                              </div>
                            </div>
                            {segmentIndex <
                              flight.itineraries[0].segments.length - 1 && (
                              <Separator className="my-2" />
                            )}
                          </div>
                        )
                      )}
                    </CardContent>
                    <CardFooter className="bg-gray-50 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">
                          Total duration:{" "}
                          {formatDuration(flight.itineraries[0].duration)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Stops: {flight.itineraries[0].segments.length - 1}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Select
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No flights found. Please try a different search.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarDaysIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

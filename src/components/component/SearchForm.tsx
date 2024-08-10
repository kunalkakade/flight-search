"use client";
import React, { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { AirportSearchInput } from "./AirportSearchInput";
import { CalendarDaysIcon } from "@/components/component/Icons";
import { format } from "date-fns";
import FlightSearchList from "./FlightSearchList";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// const API_BASE_URL = "http://localhost:3001";
const API_BASE_URL = "https://flight-search-backend-z09f.onrender.com";



export const SearchForm: React.FC = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState("1");
  const [loading, setLoading] = useState(false);
  const [amadeusFlights, setAmadeusFlights] = useState([]);
  const [serpFlights, setSerpFlights] = useState([]);
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  const validateInputs = () => {
    const newErrors: string[] = [];

    if (!from) newErrors.push("Please select a departure airport.");
    if (!to) newErrors.push("Please select an arrival airport.");
    if (!departureDate) newErrors.push("Please select a departure date.");
    if (isRoundTrip && !returnDate) newErrors.push("Please select a return date for round-trip flights.");
    
    if (from === to) newErrors.push("Departure and arrival airports cannot be the same.");
    
    if (departureDate && isRoundTrip && returnDate) {
      if (returnDate < departureDate) {
        newErrors.push("Return date must be after the departure date.");
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      // Call both APIs
      const [amadeusResponse, serpApiResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/search-flights`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            originCode: from,
            destinationCode: to,
            departureDate: departureDate ? format(departureDate, 'yyyy-MM-dd') : undefined,
            returnDate: isRoundTrip && returnDate ? format(returnDate, 'yyyy-MM-dd') : undefined,
            adults: passengers,
          }),
        }),
        fetch(`${API_BASE_URL}/serp-flight-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            originCode: from,
            destinationCode: to,
            departureDate: departureDate ? format(departureDate, 'yyyy-MM-dd') : undefined,
            returnDate: isRoundTrip && returnDate ? format(returnDate, 'yyyy-MM-dd') : undefined,
            roundTrip: isRoundTrip,
          }),
        }),
      ]);

      const amadeusData = await amadeusResponse.json();
      const serpApiData = await serpApiResponse.json();

      setAmadeusFlights(amadeusData.data);
      setSerpFlights(serpApiData.data.best_flights.concat(serpApiData.data.other_flights));
    } catch (error) {
      console.error('Error searching flights:', error);
      setErrors(["An error occurred while searching for flights. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {errors.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            <ul className="list-disc pl-5">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700">From</label>
          <AirportSearchInput
            onChange={setFrom}
            placeholder="Enter departure airport"
          />
        </div>
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700">To</label>
          <AirportSearchInput
            onChange={setTo}
            placeholder="Enter arrival airport"
          />
        </div>
        <div>
          <label htmlFor="departure-date" className="block text-sm font-medium text-gray-700">Departure Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="departure-date"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarDaysIcon className="mr-2 h-4 w-4" />
                {departureDate ? format(departureDate, 'PPP') : <span>Pick a date</span>}
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
          <label htmlFor="return-date" className="block text-sm font-medium text-gray-700">Return Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="return-date"
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={!isRoundTrip}
              >
                <CalendarDaysIcon className="mr-2 h-4 w-4" />
                {returnDate && isRoundTrip ? format(returnDate, 'PPP') : <span>Pick a date</span>}
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
          <label htmlFor="passengers" className="block text-sm font-medium text-gray-700">Passengers</label>
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger id="passengers">
              <SelectValue placeholder="Select number of passengers" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} passenger{num > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="round-trip" 
            checked={isRoundTrip}
            onCheckedChange={(checked: any) => {
              setIsRoundTrip(checked as boolean);
              if (!checked) {
                setReturnDate(undefined);
              }
            }}
          />
          <Label htmlFor="round-trip">Round-trip</Label>
        </div>
        <div className="col-span-1 md:col-span-2">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search Flights"}
          </Button>
        </div>
      </form>

      {(amadeusFlights.length > 0 || serpFlights.length > 0) && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          {amadeusFlights.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Amadeus Results</h3>
              <FlightSearchList flights={amadeusFlights} source="amadeus" />
            </div>
          )}
          {serpFlights.length > 0 && (
            <div>
              {/* <h3 className="text-xl font-semibold mb-2">Google Flights Results</h3> */}
              <FlightSearchList flights={serpFlights} source="serp" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
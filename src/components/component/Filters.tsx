import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface FiltersProps {
  airline: string;
  setAirline: (value: string) => void;
  departureTime: string;
  setDepartureTime: (value: string) => void;
  arrivalTime: string;
  setArrivalTime: (value: string) => void;
  stops: string;
  setStops: (value: string) => void;
  airlines: any[];
}

export const Filters: React.FC<FiltersProps> = ({
  airline,
  setAirline,
  departureTime,
  setDepartureTime,
  arrivalTime,
  setArrivalTime,
  stops,
  setStops,
  airlines,
}) => {
  return (
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
            {/* {airlines?.map((airline: any) => (
              <SelectItem key={airline.iataCode} value={airline.iataCode}>
                {airline.name}
              </SelectItem>
            ))} */}
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
  );
};
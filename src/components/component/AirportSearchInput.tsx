import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { searchAirports, Airport } from '@/lib/airportData';

interface AirportSearchInputProps {
  onChange: (value: string) => void;
  placeholder: string;
}

export const AirportSearchInput: React.FC<AirportSearchInputProps> = ({
  onChange,
  placeholder
}) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Airport[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const results = searchAirports(newValue);
    setOptions(results);
  };

  const handleSelect = (airport: Airport) => {
    setInputValue(`${airport.iataCode} - ${airport.name}`);
    onChange(airport.iataCode);
    setOptions([]);
  };

  return (
    <div className="relative">
      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
      {options.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((airport) => (
            <div
              key={airport.iataCode}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(airport)}
            >
              <div className="font-semibold">{airport.iataCode} - {airport.name}</div>
              <div className="text-sm text-gray-500">{airport.city}, {airport.country}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
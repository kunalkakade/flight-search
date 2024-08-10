import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface FlightResultsProps {
  flights: any[];
}

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

export const FlightResults: React.FC<FlightResultsProps> = ({ flights }) => {
  return (
    <div className="space-y-6">
      {flights.map((flight: any, index: number) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Flight #{flight.id || `SERP-${index}`}</span>
              <span className="text-lg font-normal">
                {flight.price.total || flight.price} {flight.price.currency || 'USD'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(flight.itineraries || [flight]).map((itinerary: any, itineraryIndex: number) => (
              <div key={itineraryIndex} className="mb-4">
                {(itinerary.segments || [itinerary]).map((segment: any, segmentIndex: number) => (
                  <div key={segmentIndex} className="mb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">
                          {segment.departure.iataCode || segment.departure} →{" "}
                          {segment.arrival.iataCode || segment.arrival}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(segment.departure.at || segment.departureDate)} -{" "}
                          {formatDate(segment.arrival.at || segment.arrivalDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {segment.carrierCode || segment.airline} {segment.number || ''}
                        </p>
                        <p className="text-sm text-gray-600">
                          Duration: {formatDuration(segment.duration || itinerary.duration)}
                        </p>
                      </div>
                    </div>
                    {segmentIndex < (itinerary.segments || [itinerary]).length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                Total duration: {formatDuration(flight.itineraries?.[0]?.duration || flight.duration)}
              </p>
              <p className="text-sm text-gray-600">
                Stops: {(flight.itineraries?.[0]?.segments || [flight]).length - 1}
              </p>
            </div>
            <Button variant="outline" size="sm">
              Select
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
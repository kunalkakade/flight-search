'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/components/component/SearchForm'; // Adjust this import path as needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SuccessPage: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async (sessionId: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/checkout-session?sessionId=${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session data');
        }
        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error('Error fetching session:', error);
        setError('Failed to load booking details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      fetchSession(sessionId);
    } else {
      setError('No session ID found. Please try booking again.');
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isLoading && !error) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            router.push('/');
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoading, error, router]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading booking details...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">{error}</div>;
  }

  if (!session) {
    return <div className="flex justify-center items-center h-screen">No booking details found.</div>;
  }

  const renderFlightDetails = (prefix: string) => (
    <div>
      <p><strong>From:</strong> {session.metadata[`${prefix}_from`]}</p>
      <p><strong>To:</strong> {session.metadata[`${prefix}_to`]}</p>
      <p><strong>Date:</strong> {session.metadata[`${prefix}_date`]}</p>
      <p><strong>Airline:</strong> {session.metadata[`${prefix}_airline`]}</p>
      <p><strong>Flight Number:</strong> {session.metadata[`${prefix}_flight_number`]}</p>
      <p><strong>Class:</strong> {session.metadata[`${prefix}_class`]}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Booking Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">Thank you for your purchase.</p>
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Outbound Flight</CardTitle>
            </CardHeader>
            <CardContent>
              {renderFlightDetails('outbound')}
            </CardContent>
          </Card>

          {session.metadata.flight_type === 'round_trip' && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Return Flight</CardTitle>
              </CardHeader>
              <CardContent>
                {renderFlightDetails('return')}
              </CardContent>
            </Card>
          )}

          <p className="text-center"><strong>Total Paid:</strong> {session.amount_total / 100} {session.currency.toUpperCase()}</p>
          <p className="text-center mt-4">Redirecting to homepage in {countdown} seconds...</p>
          
          <div className="flex justify-center mt-4">
            <Button onClick={() => router.push('/')}>
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessPage;
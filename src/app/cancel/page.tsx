import { XCircle, Search, Phone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <XCircle className="mx-auto text-destructive w-16 h-16 mb-4" />
          <CardTitle className="text-2xl font-bold text-center">Booking Cancelled</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center mb-6">
            We are sorry to see you go. Your flight booking has been cancelled and no charges have been made.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/">
                <Search className="w-5 h-5 mr-2" />
                Search for New Flights
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/support">
                <Phone className="w-5 h-5 mr-2" />
                Contact Support
              </Link>
            </Button>
            <Link href="/support">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Link>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-8 max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">Why Book with Us?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-muted-foreground space-y-2">
            <li>✈️ Wide selection of flights</li>
            <li>💰 Competitive prices</li>
            <li>🛡️ Secure booking process</li>
            <li>🎫 Easy cancellation and refunds</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
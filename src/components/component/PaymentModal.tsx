import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51PlTskDI9pAomXvv8uojWKEciXuij7SAfVK306ayxzqLrkEPz3oCOsVQEtbKXkoI4sqWiC8WAl2b0ksbunltgtCt00LkrGRphP");

const CheckoutForm = ({ amount, onSuccess, onError, currencyCode }:any) => {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    fetch('https://flight-search-backend-z09f.onrender.com/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Math.round(amount * 100) }) // Convert to cents
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
      .catch(err => setError('Failed to load payment information. Please try again.'));
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe has not loaded. Please try again.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card information is missing. Please fill in your card details.');
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Jenny Rosen',
        },
      }
    });

    if (error) {
      setError(error.message || 'An error occurred. Please try again.');
      onError(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <CardElement className="p-3 border border-input rounded-md bg-background" />
      </div>
      {error && <div className="text-destructive">{error}</div>}
      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full"
      >
        {loading ? 'Processing...' : `Pay ${amount} ${currencyCode}`}
      </Button>
    </form>
  );
};

const PaymentModal = ({ flight, onClose }:any) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
  };

  const handlePaymentError = (errorMessage: string) => {
    console.error('Payment failed:', errorMessage);
    // You might want to show this error to the user
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{paymentSuccess ? 'Payment Successful' : 'Complete Your Booking'}</DialogTitle>
        </DialogHeader>
        {paymentSuccess ? (
          <div className="text-center p-6">
            <p className="text-foreground mb-4">Thank you for your purchase!</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : (
          <Elements stripe={stripePromise}>
            <CheckoutForm
              amount={flight.price}
              currencyCode={flight.currency}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
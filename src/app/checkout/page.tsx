"use client";
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51PlTskDI9pAomXvv8uojWKEciXuij7SAfVK306ayxzqLrkEPz3oCOsVQEtbKXkoI4sqWiC8WAl2b0ksbunltgtCt00LkrGRphP');

const CheckoutForm = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    fetch('https://flight-search-backend-z09f.onrender.com//create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000 }) // $10.00
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
      .catch(err => setError('Failed to load payment information. Please try again.'));
  }, []);

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
    } else if (paymentIntent.status === 'succeeded') {
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center p-6 bg-card rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-accent mb-4">Payment Successful!</h2>
        <p className="text-foreground">Thank you for your purchase.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-foreground mb-6">Checkout</h2>
      <div className="mb-4">
        <CardElement className="p-3 border border-input rounded-md bg-background" />
      </div>
      {error && <div className="text-destructive mb-4">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-2 px-4 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay $10.00'}
      </button>
    </form>
  );
};

const StripeCheckout = () => (
  <div className='p-60'>
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  </div>
);

export default StripeCheckout;
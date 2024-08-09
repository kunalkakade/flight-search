"use client";
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PlTskDI9pAomXvv8uojWKEciXuij7SAfVK306ayxzqLrkEPz3oCOsVQEtbKXkoI4sqWiC8WAl2b0ksbunltgtCt00LkrGRphP');

const InvoicePage = ({ invoiceId }) => {
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`http://localhost:3001/invoice/${invoiceId}`);
        if (!response.ok) throw new Error('Failed to fetch invoice');
        const data = await response.json();
        setInvoice(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  const handlePayment = async () => {
    try {
      const response = await fetch('http://localhost:3001/create-invoice-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      });
      if (!response.ok) throw new Error('Failed to create session');
      const { sessionId } = await response.json();

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!invoice) return <div>Loading...</div>;

  return (
    <div>
      <h1>Invoice</h1>
      <p>Amount due: ${invoice.amount_due / 100}</p>
      <p>Due date: {new Date(invoice.due_date * 1000).toLocaleDateString()}</p>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default InvoicePage;
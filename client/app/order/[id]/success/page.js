'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function SuccessPage() {
  const params = useParams(); // Get dynamic route parameters
  const searchParams = useSearchParams(); // Get query parameters

  const orderId = params.id; // Make sure your folder is named [id]
  const token = searchParams.get('token');
  const payerID = searchParams.get('PayerID');

  useEffect(() => {
    if (orderId && token && payerID) {
      console.log('Payment Success:', { orderId, token, payerID });
      // You can send a confirmation request to your backend here
    }
  }, [orderId, token, payerID]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>✅ Payment Successful!</h1>
      <p>
        Thank you for your purchase. Your order ID is: <b>{orderId}</b>
      </p>
      <p>Your payment was successfully processed.</p>
      <button onClick={() => (window.location.href = '/')}>Go to Home</button>
    </div>
  );
}

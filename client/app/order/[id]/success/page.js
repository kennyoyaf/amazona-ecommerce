"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Store } from "@/utils/Store";
import React, { useContext } from "react";
import { useEffect } from "react";

export default function SuccessPage() {
  const params = useParams(); // Get dynamic route parameters
  const searchParams = useSearchParams(); // Get query parameters
  const { state } = useContext(Store);
  const { userInfo } = state;

  const orderId = params.id; // Make sure your folder is named [id]
  const token = searchParams.get("token");
  const payerID = searchParams.get("PayerID");

  useEffect(() => {
    if (orderId && token && payerID && userInfo.accessToken) {
      console.log("Payment Success:", { orderId, token, payerID });
      // You can send a confirmation request to your backend here

      const markOrderAsPaid = async function (orderId, paymentResult) {
        try {
          const response = await fetch(
            `https://amazona-ecommerce.onrender.com/product/order/${orderId}/pay`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.accessToken}`,
              },
              body: JSON.stringify({ paymentResult }),
            }
          );

          const data = await response.json();
          if (data.success) {
            console.log("Payment updated successfully");
          }
        } catch (error) {
          console.error("Error updating payment:", error);
        }
      };
      markOrderAsPaid(orderId, {
        id: payerID,
        status: "paid",
        email_address: userInfo.user.email,
      });
    }
  }, [orderId, token, payerID, userInfo.accessToken, userInfo.user.email]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>✅ Payment Successful!</h1>
      <p>
        Thank you for your purchase. Your order ID is: <b>{orderId}</b>
      </p>
      <p>Your payment was successfully processed.</p>
      <button onClick={() => (window.location.href = "/")}>Go to Home</button>
    </div>
  );
}

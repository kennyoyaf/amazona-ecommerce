"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/router";

export default function Cancel() {
  const router = useRouter();
  const params = useParams(); // Get dynamic route parameters
  const orderId = params.id; // Make sure your folder is named [id]

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>❌ Payment Canceled</h1>
      <p>Unfortunately, your payment was not completed.</p>
      {orderId && (
        <p>
          Order ID: <b>{orderId}</b>
        </p>
      )}
      <button onClick={() => router.push("/")}>Go to Home</button>
    </div>
  );
}

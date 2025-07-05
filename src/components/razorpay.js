import React, { useState } from "react";

// Load Razorpay script
const loadRazorpayScript = (src) =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function RazorpayDonate() {
  const [amount, setAmount] = useState("");

  const handleDonate = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // 👇 Your backend should create the order and return order_id
    const orderData = await fetch("/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount * 100 }), // Convert to paise
    }).then((t) => t.json());

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Key ID
      amount: orderData.amount,
      currency: "INR",
      name: "Temple Donations",
      description: "Donation Payment",
      order_id: orderData.id,
      handler: function (response) {
        alert("Payment Successful!");
        console.log("Payment response:", response);
        // Here you can call Appwrite to record the donation
      },
      prefill: {
        name: "Donor Name", // Optional
        email: "donor@example.com",
      },
      theme: {
        color: "#fdd835",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "300px", margin: "1rem auto", border: "1px solid #eee", borderRadius: "0.5rem" }}>
      <h3>Donate Now</h3>
      <input
        type="number"
        placeholder="Amount (INR)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "0.5rem",
          border: "1px solid #ccc",
          borderRadius: "0.25rem",
        }}
      />
      <button
        onClick={handleDonate}
        style={{
          width: "100%",
          backgroundColor: "#fdd835",
          border: "none",
          padding: "0.5rem",
          borderRadius: "0.25rem",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Pay with Razorpay
      </button>
    </div>
  );
}

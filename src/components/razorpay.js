// src/utils/razorpay.js
import { Client, Functions } from "appwrite";
import conf from "../conf/conf"; 

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') 
  .setProject("685bbc97000569923490");

const functions = new Functions(client);

export const loadRazorpay = () =>
  new Promise((resolve) => {
    if (document.querySelector("#razorpay-sdk")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });


export const createRazorpayOrder = async (amount) => {
  try {
    const execution = await functions.createExecution(
      "68da7498000cb1dcaeb2", 
      JSON.stringify({ amount }),
      false
    );

    const response = JSON.parse(execution.responseBody);
    if (response.id && response.amount) {
      return response;
    } else {
      throw new Error(response.error || "Failed to create Razorpay order.");
    }
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    throw err;
  }
};

// 4️⃣ Open Razorpay Checkout
export const openRazorpayCheckout = ({ key, amount, orderId, onSuccess }) => {
  const options = {
    key,
    amount,
    currency: "INR",
    name: "Temple Donations",
    description: "Development Contribution",
    order_id: orderId,
    handler: function (response) {
      if (onSuccess) onSuccess(response);
    },
    prefill: {
      name: "Donor Name",
      email: "donor@example.com",
    },
    theme: {
      color: "#fdd835",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

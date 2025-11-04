import { useState, useEffect } from "react";
import "./developmentContribution.css";
import templeService from "../../appwrite/templeService";
import { loadRazorpay, openRazorpayCheckout } from "../razorpay";
import { Client, Functions } from "appwrite";

export default function DevelopmentContribution({ userId }) {
  const [amount, setAmount] = useState("");
  const [donations, setDonations] = useState([]);
  const [lastDocumentId, setLastDocumentId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;


  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') 
    .setProject("685bbc97000569923490");

  const functions = new Functions(client);

  useEffect(() => {
    fetchDonations();
  
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await templeService.getDonationsByType(
        "Development",
        PAGE_SIZE,
        lastDocumentId
      );
      if (res.documents.length > 0) {
        setDonations(res.documents);
        setLastDocumentId(res.documents[res.documents.length - 1].$id);
        setHasMore(res.documents.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDonate = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) return alert("Razorpay SDK failed to load.");

    try {

      const execution = await functions.createExecution(
        "68da7498000cb1dcaeb2",
        JSON.stringify({
          $method: "POST",
          $path: "/create-order",
          amount: Number(amount) * 100,
        }),
        false
      );



      const orderData = JSON.parse(execution.responseBody);

      if (!orderData.id || !orderData.amount) {
        throw new Error(orderData.error || "Failed to create order.");
      }

      // Open Razorpay checkout
      openRazorpayCheckout({
        key: "UJx8d5EkNU3rGbdLoR6EcxCQ",
        amount: orderData.amount,
        orderId: orderData.id,
        onSuccess: async (response) => {
          alert("Payment Successful!");
          console.log("Payment response:", response);

          // Save donation in Appwrite
          await templeService.addDonation({
            userId,
            eventId: "",
            type: "Development",
            amount: parseInt(amount),
          });

          setAmount("");
          setDonations([]);
          setLastDocumentId(null);
          setHasMore(true);
          fetchDonations();
        },
      });
    } catch (error) {
      console.error(error);
      alert("Error creating Razorpay order. See console for details.");
    }
  };

  function getFormatDate(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  return (
    <div className="section">
      <h2>Contribute towards Development</h2>
      <div className="dev-form">
        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleDonate}>Donate</button>
      </div>
      <h3>Previous Contributions</h3>
      <ul className="contribution-list">
        {donations.map((d) => (
          <li key={d.$id}>
            <span>{d.UserId}</span>
            <span>{d.Amount}</span>
            <span>{getFormatDate(d.TimeStamp)}</span>
          </li>
        ))}
      </ul>
      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button className="load-more-btn" onClick={fetchDonations}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

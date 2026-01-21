import { useEffect, useState } from "react";
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
    .setEndpoint(process.env.REACT_APP_APPWRITE_URL)
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

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
        setLastDocumentId(res.documents.at(-1).$id);
        setHasMore(res.documents.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Fetch donations failed:", err);
    }
  };

  const handleDonate = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      // ✅ Call Appwrite Function
      const execution = await functions.createExecution(
        process.env.REACT_APP_APPWRITE_FUNCTION_ID, // ✅ env
        JSON.stringify({ amount: Number(amount) * 100 }),
        false,
        "/create-order",
        "POST"
      );

      const order = JSON.parse(execution.responseBody);

      if (!order.id || !order.amount) {
        throw new Error("Invalid order response");
      }

      // ✅ Razorpay checkout
      openRazorpayCheckout({
        amount: order.amount,
        orderId: order.id,
        name: "Temple Development Fund",
        description: "Development Contribution",
        onSuccess: async (response) => {
          console.log("Payment success:", response);

          await templeService.addDonation({
            userId,
            eventId: "",
            type: "Development",
            amount: Number(amount),
          });

          alert("Payment successful");

          setAmount("");
          setDonations([]);
          setLastDocumentId(null);
          setHasMore(true);
          fetchDonations();
        },
      });
    } catch (err) {
      console.error("Donation failed:", err);
      alert("Payment failed");
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

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
            <span>₹{d.Amount}</span>
            <span>{formatDate(d.TimeStamp)}</span>
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

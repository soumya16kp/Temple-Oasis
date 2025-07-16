import { useState, useEffect } from 'react';
import './developmentContribution.css';
import templeService from '../../appwrite/templeService';

export default function DevelopmentContribution({ userId }) {
  const [amount, setAmount] = useState('');
  const [donations, setDonations] = useState([]);
  const [lastDocumentId, setLastDocumentId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchDonations();
  }, [donations]);

  const fetchDonations = async () => {
    try {
      const res = await templeService.getDonationsByType('Development', PAGE_SIZE, lastDocumentId);
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
     if (!amount || amount.trim() === '') {
      alert('Donation cannot be empty!');
      return;
    }
    await templeService.addDonation({
      userId,
      eventId: '',
      type: 'Development',
      amount: parseInt(amount)
    });
    setAmount('');
    setDonations([]);
    setLastDocumentId(null);
    setHasMore(true);
    fetchDonations();
  };

  function getFormatDate(inputDate) {
    const date = new Date(inputDate);
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in ms
    const istTime = new Date(date.getTime() + istOffset);

    const day = String(istTime.getDate()).padStart(2, '0');
    const month = String(istTime.getMonth() + 1).padStart(2, '0');
    const year = istTime.getFullYear();

    const hours = String(istTime.getHours()).padStart(2, '0');
    const minutes = String(istTime.getMinutes()).padStart(2, '0');

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
        {donations.map(d => (
          <li key={d.$id}>
            <span>{d.UserId}</span>
            <span>{d.Amount}</span>
            <span>{getFormatDate(d.TimeStamp)}</span>
          </li>
        ))}
      </ul>
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button className="load-more-btn" onClick={fetchDonations}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

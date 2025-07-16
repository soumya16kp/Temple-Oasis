import { useState, useEffect } from 'react';
import './commoditiesContribution.css';
import templeService from '../../appwrite/templeService';

export default function CommoditiesContribution({ userId }) {
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('');
  const [pledges, setPledges] = useState([]);
  const [lastDocumentId, setLastDocumentId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  useEffect(() => {
    refreshPledges();
  }, []);

  const loadPledgesPage = async () => {
    try {
      const res = await templeService.getDonationsByType('Commodity', PAGE_SIZE, lastDocumentId);
      if (res.documents.length > 0) {
        setPledges(prev => [...prev, ...res.documents]);
        setLastDocumentId(res.documents[res.documents.length - 1].$id);
        setHasMore(res.documents.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const refreshPledges = async () => {
    try {
      const res = await templeService.getDonationsByType('Commodity', PAGE_SIZE, null);
      setPledges(res.documents);
      if (res.documents.length > 0) {
        setLastDocumentId(res.documents[res.documents.length - 1].$id);
        setHasMore(res.documents.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePledge = async () => {
    await templeService.addDonation({
      userId,
      eventId: '',
      type: 'Commodity',
      quantity: parseInt(qty),
      item
    });
    setItem('');
    setQty('');
    setLastDocumentId(null);
    setHasMore(true);
    refreshPledges();
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
      <h2>Commodities Contribution</h2>
      <form onSubmit={handlePledge}>
      <div className="commodities-form">
        
        <input
          type="text"
          placeholder="Item Name"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          required
          onChange={(e) => setQty(e.target.value)}
          
        />
        <button type="submit">Pledge</button>
      </div>
      </form>
      <h3>Previous Commodities Contributions</h3>
      <ul className="contribution-list">
        {pledges.map(p => (
          <li key={p.$id}>
            <span>{p.UserId}</span>
            <span>{p.Item}</span>
            <span>{p.Quantity} units</span>
            <span>{getFormatDate(p.TimeStamp)}</span>
          </li>
        ))}
      </ul>
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button className="load-more-btn" onClick={loadPledgesPage}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

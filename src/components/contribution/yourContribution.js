import { useEffect, useState } from 'react';
import templeService from '../../appwrite/templeService';
import './yourContributions.css';

function ContributionCard({ amount, date, message }) {
  return (
    <div className="contribution-card">
      <h3 className="contribution-amount">₹ {amount}</h3>
      <p className="contribution-date">{date}</p>
      {message && <p className="contribution-message">{message}</p>}
    </div>
  );
}

export default function YourContributions({ userId }) {
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    async function fetchContributions() {
      try {
        const result = await templeService.getDonationsByUser(userId);
        console.log('Fetched contributions:', result);
        setContributions(result.documents || []);
      } catch (error) {
        console.error('Error loading contributions:', error);
        setContributions([]); 
      }
    }

    if (userId) {
      fetchContributions();
    }
  }, [userId]);

  return (
    <section className="your-contributions">
      <h2>Your Past Contributions</h2>
      
      {contributions.length === 0 ? (
        <p>You have not made any contributions yet.</p>
      ) : (
        <div className="contribution-grid">
          {contributions.map(contribution => (
            <ContributionCard
              key={contribution.$id}
              amount={contribution.Amount}
              date={contribution.TimeStamp}
            />
          ))}
        </div>
      )}
    </section>
  );
}

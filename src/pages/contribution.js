import { useState,useEffect } from 'react';
import authService from '../appwrite/authService';
import OngoingEvents from '../components/contribution/ongoingEvent';
import DevelopmentContribution from '../components/contribution/developmentContribution';
import CommoditiesContribution from '../components/contribution/commoditiesContribution';
import './contribution.css';

export default function Contribution() {
  const [activeTab, setActiveTab] = useState('events');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const user = await authService.getCurrentUser();
      setUserId(user?.$id);
    }
    fetchUser();
  }, [userId]);
  console.log(userId)
  return (
    <div className="contribution-page">
      <h1>Temple Contribution</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab('events')}>Ongoing Events</button>
        <button onClick={() => setActiveTab('development')}>Development</button>
        <button onClick={() => setActiveTab('commodities')}>Commodities</button>
      </div>
      
      {activeTab === 'events' && <OngoingEvents userId={userId} />}
      {activeTab === 'development' && <DevelopmentContribution userId={userId} />}
      {activeTab === 'commodities' && <CommoditiesContribution userId={userId} />}
    </div>
  );
}

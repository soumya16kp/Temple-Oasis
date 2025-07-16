import { useState,useEffect } from 'react';
import authService from '../appwrite/authService';
import OngoingEvents from '../components/contribution/ongoingEvent';
import DevelopmentContribution from '../components/contribution/developmentContribution';
import CommoditiesContribution from '../components/contribution/commoditiesContribution';
import './contribution.css';
import donation from '../images/hands-giving-receiving-charity-donation-coin_184560-344.avif'
import donationVector from '../images/heart-and-helping-hands-illustration-for-charity-and-donation-in-a-flat-background-vector.jpg'

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
      <header className="contribution-header">
        <div className="header-content">
          <h1>Temple Contribution</h1>
          <p>Support the temple's mission through events, development, and donations.</p>
        </div>
        <img src={donation} alt="Donation" />
      </header>
      
      <div className="tabs">
        <button onClick={() => setActiveTab('events')}>Ongoing Events</button>
        <button onClick={() => setActiveTab('development')}>Development</button>
        <button onClick={() => setActiveTab('commodities')}>Commodities</button>
      </div>
      
      {activeTab === 'events' && <OngoingEvents userId={userId} />}
      {activeTab === 'development' && <DevelopmentContribution userId={userId} />}
      {activeTab === 'commodities' && <CommoditiesContribution userId={userId} />}

      <div className='footer-imgcontainer'>
        <h2 className='footer-thankyou'>Thank you for your donation!</h2>
        <p className='footer-message'>
          Your generous support helps us continue our mission and make a real difference. We truly appreciate your kindness.
        </p>
        <img src={donationVector} alt="Donation illustration" />
      </div>

    </div>

    
  );
}

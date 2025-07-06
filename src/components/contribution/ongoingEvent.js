import { useEffect, useState } from 'react';
import templeService from '../../appwrite/templeService';
import eventsService from '../../appwrite/eventsService';
import './ongoingEvent.css';

export default function OngoingEvents({ userId }) {
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [activeDonateEventId, setActiveDonateEventId] = useState(null);
  const [activeAmount, setActiveAmount] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');
  const [activeMenuEventId, setActiveMenuEventId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [ongoingEvent, setOngoingEvent] = useState(true);

  useEffect(() => {
    fetchEvents();
    fetchDonations();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await templeService.getEvents();
      setEvents(res.documents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchDonations = async () => {
    try {
      const res = await templeService.getDonationsByType("Event");
      setDonations(res.documents);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const handlePreviousEvents = () => {
    setOngoingEvent(!ongoingEvent);
  };

  const handleSubmitDonation = async (eventId, amount) => {
    try {
      const parsedAmount = parseInt(amount);
      if (isNaN(parsedAmount)) {
        alert("Please enter a valid amount");
        return;
      }

      const thisEvent = events.find(ev => ev.$id === eventId);
      const existingAmount = thisEvent.CollectedAmount || 0;
      const updatedAmount = existingAmount + parsedAmount;

      await eventsService.updateEvent(eventId, { CollectedAmount: updatedAmount });
      await templeService.addDonation({
        userId,
        eventId,
        type: 'Event',
        amount: parsedAmount
      });

      await fetchEvents();
      await fetchDonations();
      setActiveDonateEventId(null);
      setActiveAmount('');
    } catch (error) {
      console.error('Error adding donation:', error);
    }
  };

  const handleMarkCompleted = async (eventId) => {
    try {
      const newStatus = ongoingEvent ? 'completed' : 'active';
      await eventsService.updateEvent(eventId, { status: newStatus });
      await fetchEvents();
      setActiveMenuEventId(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleChangeDate = async (eventId, dateStr) => {
    try {
      if (!dateStr) {
        alert('Please select a date');
        return;
      }
      const isoDate = new Date(dateStr).toISOString();
      await eventsService.updateEvent(eventId, { Date: isoDate });
      await fetchEvents();
      setActiveMenuEventId(null);
      setNewDate('');
    } catch (error) {
      console.error('Error updating date:', error);
    }
  };

  function getFormatDate(inputDate) {
    if (!inputDate) return '';
    const date = new Date(inputDate);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(date.getTime() + istOffset);

    const day = String(istTime.getDate()).padStart(2, '0');
    const month = String(istTime.getMonth() + 1).padStart(2, '0');
    const year = istTime.getFullYear();

    let hours = istTime.getHours();
    const minutes = String(istTime.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = String(hours).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  }

  const filteredDonations = selectedEventFilter === 'all'
    ? donations
    : donations.filter(d => d.EventId === selectedEventFilter);

  return (
    <div className="events-dashboard">
      <header className="dashboard-header">
        <h1>{ongoingEvent ? 'Ongoing Events' : 'Completed Events'}</h1>
        <button 
          className="toggle-events-btn"
          onClick={handlePreviousEvents}
        >
          {ongoingEvent ? 'Show Completed Events' : 'Show Ongoing Events'}
        </button>
      </header>

      <div className="events-grid">
        {events
          .filter(ev => ongoingEvent ? ev.status === 'active' : ev.status === 'completed')
          .map(event => (
            <div key={event.$id} className="event-card">
              <div className="card-header">
                <h3>{event.Title}</h3>
                <div className="card-actions">
                  {ongoingEvent && (
                    <button 
                      className="donate-btn"
                      onClick={() => setActiveDonateEventId(
                        activeDonateEventId === event.$id ? null : event.$id
                      )}
                    >
                      {activeDonateEventId === event.$id ? 'Cancel' : 'Donate'}
                    </button>
                  )}
                  <div className="dropdown-container">
                    <button 
                      className="menu-toggle"
                      onClick={() => setActiveMenuEventId(
                        activeMenuEventId === event.$id ? null : event.$id
                      )}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
                      </svg>
                    </button>
                    {activeMenuEventId === event.$id && (
                      <div className="dropdown-menu">
                        <button onClick={() => handleMarkCompleted(event.$id)}>
                          <span>✓</span> {ongoingEvent ? 'Mark Completed' : 'Mark Active'}
                        </button>
                        <div className="date-picker">
                          <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                          />
                          <button onClick={() => handleChangeDate(event.$id, newDate)}>
                            Update Date
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <p className="event-description">{event.Description}</p>
              
              <div className="event-metrics">
                <div className="metric">
                  <span className="metric-label"><strong>Status: </strong>{event.status} </span>
                  <span className="metric-label"><strong>Collected₹: </strong>{event.CollectedAmount || '0'}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Last Date</span>
                  <span className="metric-value">{getFormatDate(event.Date)}</span>
                </div>
              </div>

              {activeDonateEventId === event.$id && ongoingEvent && (
                <div className="donation-form">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={activeAmount}
                    onChange={(e) => setActiveAmount(e.target.value)}
                  />
                  <button 
                    className="confirm-btn"
                    onClick={() => handleSubmitDonation(event.$id, activeAmount)}
                  >
                    Confirm Donation
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      <div className="donations-container">
        <h3>Donation Records</h3>
        <div className="donation-filter">
          <label>Filter by event: </label>
          <select
            value={selectedEventFilter}
            onChange={(e) => setSelectedEventFilter(e.target.value)}
          >
            <option value="all">All Events</option>
            {events.map(ev => (
              <option key={ev.$id} value={ev.$id}>{ev.Title}</option>
            ))}
          </select>
        </div>

        <div className="donations-grid">
          {filteredDonations.length > 0 ? (
            filteredDonations.map(donation => (
              <div key={donation.$id} className="donation-card">
                <div className="donation-header">
                  <span className="donation-amount">₹{donation.Amount}</span>
                  <span className="donation-date">{getFormatDate(donation.TimeStamp)}</span>
                </div>
                <div className="donation-details">
                  <span>Event: {events.find(e => e.$id === donation.EventId)?.Title || donation.EventId}</span>
                  <span>User: {donation.UserId}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-donations">
              No donations found for selected filter
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import './ongoingEvent.css';
import templeService from '../../appwrite/templeService';
import eventsService from '../../appwrite/eventsService';

export default function OngoingEvents({ userId }) {
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [activeDonateEventId, setActiveDonateEventId] = useState(null);
  const [activeAmount, setActiveAmount] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');
  const [activeMenuEventId, setActiveMenuEventId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [ongoingEvent,setongoingEvent]= useState(true);

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
  const handlePreviousEvents=()=>{
      setongoingEvent(!ongoingEvent);
  }
  const handleSubmitDonation = async (eventId, amount) => {
    try {
      const parsedAmount = parseInt(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      const thisEvent = events.find(ev => ev.$id === eventId);
      const existingAmount = thisEvent.CollectedAmount ?? 0;
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
      if(ongoingEvent){
        await eventsService.updateEvent(eventId, { status: 'completed' });
      }
      if(!ongoingEvent){
        console.log("first");
        await eventsService.updateEvent(eventId, { status: 'active' });
      }
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
    <div className="section">
      <div className="events-container">
        <div className="events-header">
          <h2>{ongoingEvent ? 'Ongoing Events' : 'Completed Events'}</h2>
          <button onClick={handlePreviousEvents}>
            {ongoingEvent ? 'Show Previous Events' : 'Show Ongoing Events'}
          </button>
        </div>
        <div className="events-grid">
          {ongoingEvent && events.filter(ev => ev.status === 'active').map(event => (
            <div key={event.$id} className="event-card">
              <div className="card-header">
                <h3>{event.Title}</h3>
                <button
                  className="menu-toggle"
                  onClick={() => setActiveMenuEventId(activeMenuEventId === event.$id ? null : event.$id)}
                >
                  ⋯
                </button>
                {activeMenuEventId === event.$id && (
                  <div className="card-dropdown">
                    <button onClick={() => handleMarkCompleted(event.$id)}>
                       Mark as Completed
                    </button>
                    <div className="dropdown-date">
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                      />
                      <button onClick={() => handleChangeDate(event.$id, newDate)}>
                        Change Date
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <p>{event.Description}</p>
              <p><strong>Status:</strong> {event.status || 'Ongoing'}</p>
              <p><strong>Collected:</strong> ₹{event.CollectedAmount}</p>
              <p>Last Date {getFormatDate(event.Date)}</p>

              {activeDonateEventId === event.$id ? (
                <div className="donate-inline">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={activeAmount}
                    onChange={(e) => setActiveAmount(e.target.value)}
                  />
                  <button onClick={() => handleSubmitDonation(event.$id, activeAmount)}>
                    Confirm
                  </button>
                  <button onClick={() => setActiveDonateEventId(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button className="donate-button" onClick={() => setActiveDonateEventId(event.$id)}>
                  Donate
                </button>
              )}
            </div>
          ))}
          {!ongoingEvent && events.filter(ev => ev.status === 'completed').map(event => (
            <div key={event.$id} className="event-card">
              <div className="card-header">
                <h3>{event.Title}</h3>
                <button
                  className="menu-toggle"
                  onClick={() => setActiveMenuEventId(activeMenuEventId === event.$id ? null : event.$id)}
                >
                  ⋯
                </button>
                {activeMenuEventId === event.$id && (
                  <div className="card-dropdown">
                    <button onClick={() => handleMarkCompleted(event.$id)}>
                       Mark as Active
                    </button>
                    <div className="dropdown-date">
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                      />
                      <button onClick={() => handleChangeDate(event.$id, newDate)}>
                        Change Date
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <p>{event.Description}</p>
              <p><strong>Status:</strong> {event.status}</p>
              <p><strong>Collected:</strong> ₹{event.CollectedAmount}</p>
              <p>Last Date {getFormatDate(event.Date)}</p>

            </div>
          ))}
        </div>
      </div>

      <div className="donations-container">
        <h3>Previous Donations</h3>
        <div className="donation-filter">
          <label>Show donations for: </label>
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

        <ul className="donation-list">
          {filteredDonations.map(d => (
            <li key={d.$id} className="donation-item">
              <span><strong>User:</strong> {d.UserId}</span>
              <span><strong>Amount:</strong> ₹{d.Amount}</span>
              <span><strong>Event ID:</strong> {d.EventId}</span>
              <span><strong>Time:</strong> {getFormatDate(d.TimeStamp)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

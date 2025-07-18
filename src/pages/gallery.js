import { useEffect, useState } from 'react';
import {SelectEventForm} from '../components';
import eventService from '../appwrite/eventsService';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/loading';
import './gallery.css';

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
function EventCard({ event,onClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const photos = event.ImageIds || [];


  useEffect(() => {
    if (photos.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [photos]);

  const currentPhotoUrl =
    photos.length > 0
      ? eventService.getFilePreview(photos[currentIndex])
      : null;

  return (
    <div className="event-card" onClick={onClick}>
      {currentPhotoUrl && (
        <img
          className="event-card-image"
          src={currentPhotoUrl}
          alt="Event"
        />
      )}
      <div className="event-card-body">
        <h3 className="event-card-title">{event.Title}</h3>
        <p className='semiheader' style={{textAlign: 'center'}}><strong>Venue Date : {getFormatDate(event.EventDate)}</strong></p>
        <p className="event-card-description">{event.Description}</p>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const navigate=useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventService.listEvents();
      setEvents(res.documents);
      setMessage('');
    } catch (err) {
      console.error(err);
      setMessage('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventCreated = () => {
    setShowForm(false);
    fetchEvents();
  };

  return (
    <div className='gallery'>
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>Gallery</h2>
        <button className="add-event-button" onClick={() => setShowForm(true)}>
          + Add Event
        </button>
      </div>

      {showForm && (
        <SelectEventForm
          onCreated={handleEventCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading && <Loading/>}
      {message && <p>{message}</p>}

      <div className="events-list">
        {events.length === 0 && !loading && <p>No events found.</p>}
        {events
        .filter(event => Array.isArray(event.ImageIds) && event.ImageIds.length > 0)  
        .map(event => (
          <EventCard 
            key={event.$id} event={event}
            onClick={()=>navigate(`/gallery/${event.$id}`)}
           />
        ))}
      </div>
    </div>
    </div>
  );
}

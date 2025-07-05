import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UpdateGalleryForm } from '../components';
import eventService from '../appwrite/eventsService';
import './event.css';

export default function Event() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.getEvent(id);
        setEvent(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSaveDescription = async () => {
    try {
      setLoading(true);
      await eventService.updateEvent(id, { Description: descriptionInput });
      const updated = await eventService.getEvent(id);
      setEvent(updated);
      setIsEditingDescription(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="single-event-loading">Loading...</div>;
  }

  if (!event) {
    return <div className="single-event-error">Event not found.</div>;
  }

  return (
    <div className="single-event-card">
      <h1 className="single-event-title">{event.Title}</h1>

      <div
        className="single-event-description-container"
        onMouseEnter={() => !isEditingDescription && setIsEditingDescription(false)}
        onMouseLeave={() => !isEditingDescription && setIsEditingDescription(false)}
      >
        {isEditingDescription ? (
          <div className="single-event-description-edit">
            <textarea
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              rows={4}
              placeholder="Enter event description..."
            />
            <div className="description-edit-actions">
              <button onClick={handleSaveDescription}>Save</button>
              <button onClick={() => setIsEditingDescription(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="single-event-description">
            {event.Description ? event.Description : <span className="placeholder">No description added yet.</span>}
            <button
              className="edit-description-button"
              onClick={() => {
                setDescriptionInput(event.Description || '');
                setIsEditingDescription(true);
              }}
            >
               Edit
            </button>
          </div>
        )}
      </div>

      <div className="single-event-image-grid">
        {event.ImageIds?.map((imageId) => (
          <img
            key={imageId}
            src={eventService.getFilePreview(imageId)}
            alt={event.Title}
            className="single-event-image"
          />
        ))}
      </div>

      <button className="add-event-button" onClick={() => setShowForm(true)}>
        + Add Photos
      </button>

      {showForm && (
        <UpdateGalleryForm
          id={id}
          event={event}
          onCreated={() => {
            setShowForm(false);
            setLoading(true);
            eventService.getEvent(id).then(setEvent).finally(() => setLoading(false));
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

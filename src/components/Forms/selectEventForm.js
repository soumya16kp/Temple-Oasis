import { useEffect, useState } from 'react';
import './selectEventForm.css';
import eventService from '../../appwrite/eventsService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
export default function SelectEventForm({ onCreated, onCancel }) {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    try {
      const res = await eventService.listEvents();
      setEvents(res.documents);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const handleRemovePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEventId) {
      setMessage('Please select an event to update.');
      return;
    }

    try {
      setSaving(true);
      setMessage('Saving...');

      const uploadedPhotoIds = [];
      for (let file of photos) {
        const uploaded = await eventService.uploadFile(file);
        if (uploaded && uploaded.$id) {
          uploadedPhotoIds.push(uploaded.$id);
        }
      }

      await eventService.updateEvent(selectedEventId, {
        ImageIds: uploadedPhotoIds,
      });

      setMessage('Event updated successfully!');
      setPhotos([]);
      setPreviewUrls([]);
      setSelectedEventId('');
      
      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      console.error(err);
      setMessage('Error updating event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="event-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Event to Update Photos</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            required
          >
            <option value=""> Select an Event</option>
            {events.map(ev => (
              <option key={ev.$id} value={ev.$id}>
                {ev.Title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Upload New Photos</label>
          <input type="file" accept="image/*" multiple onChange={handlePhotoChange} />
        </div>

        <div className="photo-previews">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="photo-preview">
              <img src={url} alt="preview" height={100} />
              <button type="button" onClick={() => handleRemovePhoto(idx)}>
                <FontAwesomeIcon icon={faMinusCircle} />
              </button>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Event'}
          </button>
          <button type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        </div>
      </form>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

import { useState } from 'react';
import './addEventForm.css';
import eventService from '../../appwrite/eventsService';

export default function AddEventForm({ onCreated, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage('Title is required');
      return;
    }

    try {
      setSaving(true);
      setMessage('Saving...');

      await eventService.createEvent({
        title,
        description,
        lastDate,
        eventDate
      });

      setMessage('Event created successfully!');
      setTitle('');
      setDescription('');
      setLastDate('');
      setEventDate('');
      
      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      console.error(err);
      setMessage('Error saving event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="event-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Last Date of Closing</label>
          <input
            type="date"
            value={lastDate}
            onChange={e => setLastDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Event Date</label>
          <input
            type="date"
            value={eventDate}
            onChange={e => setEventDate(e.target.value)}
            required
          />
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

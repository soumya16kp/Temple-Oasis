import { useState } from 'react';
import './addEventForm.css';
import eventService from '../appwrite/eventsService';

export default function AddEventForm({ onCreated, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

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
    if (!title.trim()) {
      setMessage('Title is required');
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

      await eventService.createEvent({
        title,
        description,
        photoIds: uploadedPhotoIds,
      });

      setMessage('Event created successfully!');
      setTitle('');
      setDescription('');
      setPhotos([]);
      setPreviewUrls([]);
      
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
          <label>Photos</label>
          <input type="file" accept="image/*" multiple onChange={handlePhotoChange} />
        </div>

        <div className="photo-previews">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="photo-preview">
              <img src={url} alt="preview" height={100} />
              <button type="button" onClick={() => handleRemovePhoto(idx)}>
                Remove
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

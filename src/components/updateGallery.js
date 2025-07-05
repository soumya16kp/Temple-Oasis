import { useState } from 'react';
import './updateGallery.css';
import eventService from '../appwrite/eventsService';

export default function UpdateGalleryForm({id,event, onCreated, onCancel }) {
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
  console.log('Event page ID:', id);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      await eventService.updateEvent(id,{
        ImageIds: [
            ...(event.ImageIds || []),
            ...uploadedPhotoIds
        ]});

      setMessage('Added successfully!');
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

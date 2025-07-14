import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UpdateGalleryForm } from '../components';
import eventService from '../appwrite/eventsService';
import Masonry from 'react-masonry-css';
import Loading from '../components/loading';
import './event.css';

export default function Event() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.getEvent(id);
        setEvent(data);
        setImages(data.ImageIds?.map(imageId => ({
          id: imageId,
          url: eventService.getFilePreview(imageId)
        })) || []);
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
    return (
      <div className="loading-container">
        <Loading/>
      </div>
    );
  }

  if (!event) {
    return <div className="not-found">Event not found</div>;
  }

  return (
    <div className="event-gallery">
      <header className="gallery-header">
        <div className="header-content">
          <h1 className="event-title">{event.Title}</h1>
          <p className="event-date">
            {new Date(event.EventDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </header>

      <section className="description-section">
        {isEditingDescription ? (
          <div className="description-editor">
            <textarea
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              className="description-input"
              placeholder="Describe the event..."
            />
            <div className="editor-actions">
              <button className="save-btn" onClick={handleSaveDescription}>
                Save
              </button>
              <button 
                className="cancel-btn"
                onClick={() => setIsEditingDescription(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="description-display">
            <p>{event.Description || 'No description available'}</p>
            <button
              className="edit-btn"
              onClick={() => {
                setDescriptionInput(event.Description || '');
                setIsEditingDescription(true);
              }}
            >
              Edit Description
            </button>
          </div>
        )}
      </section>

      <section className="image-gallery">
        {images.length > 0 ? (
          <Masonry
            breakpointCols={{
              default: 3,
              900: 2,
              600: 1
            }}
            className="masonry-grid"
            columnClassName="masonry-column"
          >
            {images.map((image) => (
              <div
                key={image.id}
                className="masonry-item"
                onClick={() => setCurrentImage(image.url)}
              >
                <img
                  src={image.url}
                  alt={`From ${event.Title}`}
                  loading="lazy"
                />
                <div className="image-overlay"></div>
              </div>
            ))}
          </Masonry>
        ) : (
          <div className="empty-gallery">
            <p>No images added yet</p>
          </div>
        )}

        <button className="add-photos-btn" onClick={() => setShowForm(true)}>
          <span className="plus-icon">+</span> Add Photos
        </button>
      </section>

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

      {currentImage && (
        <div className="image-modal" onClick={() => setCurrentImage(null)}>
          <div className="modal-content">
            <img src={currentImage} alt="Enlarged view" />
          </div>
        </div>
      )}
    </div>
  );
}


import { useEffect, useState } from 'react';
import './account.css';
import userService from '../appwrite/userService';
import authService from '../appwrite/authService';
import { useDispatch } from 'react-redux';
import { logout } from '../store/AuthSlice';


const Account = () => {


  const dispatch=useDispatch();
  const LogoutHandler = async () => {
        await authService.logout();
        dispatch(logout());
  };
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [accountId, setAccountId] = useState('');

  const [user, setUser] = useState({
    name: '',
    email: '',
    contact: '',
    designation: '',
    photo: ''
  });

  const [formData, setFormData] = useState(user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
      
        const account = await authService.getCurrentUser();
        setAccountId(account.$id);

        const data = await userService.getUser(account.$id);
        const safeUser = {
          name: data?.Name ?? '',
          email: data?.Email ?? '',
          contact: data?.Mobile ?? '',
          designation: data?.Position ?? '',
          photo: data?.Image ?? ''
        };

        setUser(safeUser);
        setFormData(safeUser);
      } catch (error) {
        console.error('Error fetching user data:', error);
        showToast('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast('Name is required.');
      return false;
    }
    if (!formData.email.trim()) {
      showToast('Email is required.');
      return false;
    }
    return true;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e) => {
  const file = e.target.files[0];
    if (!file) return;

    try {
      const uploaded = await userService.uploadFile(file);
      if (uploaded && uploaded.$id) {
        setFormData((prev) => ({ ...prev, photo: uploaded.$id }));
        showToast('Photo uploaded successfully!');
      } else {
        showToast('Photo upload failed.');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      showToast('Failed to upload photo.');
    }
  };


  const handleEditToggle = async () => {
    if (isEditing) {
      if (!validateForm()) return;

      try {
        setSaving(true);
        await userService.updateUser(accountId, {
          Name: formData.name,
          Email: formData.email,
          Mobile: formData.contact,
          Position: formData.designation,
          Image: formData.photo
        });

        setUser(formData);
        setIsEditing(false);
        showToast('Profile updated successfully!');
      } catch (error) {
        console.error('Error saving user data:', error);
        showToast('Failed to save changes.');
      } finally {
        setSaving(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  if (loading) {
    return (
      <div className="account-page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="account-page">
      {toastMessage && (
        <div className="toast">
          {toastMessage}
        </div>
      )}

      <div className="card">
        <div className="photo-section">
          <img
            src={ userService.getFilePreview(formData.photo)}
            alt="Profile"
            className="profile-photo"
          />

          {isEditing && (
            <label className="photo-upload">
              Change Photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} />
            </label>
          )}
        </div>

        <div className="info-section">
          <div className="field">
            <label>Name</label>
            {isEditing ? (
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            ) : (
              <span>{user.name}</span>
            )}
          </div>

          <div className="field">
            <label>Email</label>
            {isEditing ? (
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            ) : (
              <span>{user.email}</span>
            )}
          </div>

          <div className="field">
            <label>Contact</label>
            {isEditing ? (
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
              />
            ) : (
              <span>{user.contact}</span>
            )}
          </div>

          <div className="field">
            <label>Designation</label>
            {isEditing ? (
              <input
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              />
            ) : (
              <span>{user.designation}</span>
            )}
          </div>

          <button
            onClick={handleEditToggle}
            className="edit-button"
            disabled={saving}
          >
            {isEditing ? (saving ? 'Saving...' : 'Save') : 'Edit'}
          </button>

          <button
            onClick={LogoutHandler}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;

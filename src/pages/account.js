

import { useEffect, useState } from 'react';
import './account.css';
import defaultUserProfile from '../images/sbcf-default-avatar.png'
import UserForm from '../components/Forms/userForm';
import userService from '../appwrite/userService';
import authService from '../appwrite/authService';
import YourContributions from '../components/contribution/yourContribution';
import { useDispatch } from 'react-redux';
import { logout } from '../store/AuthSlice';
import Loading from '../components/loading';


const Account = () => {
  const dispatch = useDispatch();
  const LogoutHandler = async () => {
    await authService.logout();
    dispatch(logout());
  };

  const [newUser, setNewUser] = useState(false);
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
        setNewUser(true);
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
        <Loading />
      </div>
    );
  }

  return newUser ? (< UserForm />) : (
    <div className="account-page">
      {toastMessage && (
        <div className="toast">
          {toastMessage}
        </div>
      )}
      <div className='account-header'>
        <h2>My Account</h2>
        <button
          onClick={LogoutHandler}
          className="logout-btn"
        >
          Logout
        </button>
      </div>

      <div className='user-interface'>

        <div className="account-card">
          <div className="account-photo-section">
            <img
              src={formData?.photo ? userService.getFilePreview(formData.photo) : defaultUserProfile}
              alt="Profile"
              className="account-profile-photo"
            />
            {isEditing && (
              <label className="photo-upload">
                Change Photo
                <input type="file" accept="image/*" onChange={handlePhotoChange} />
              </label>
            )}
          </div>

          <div className="account-info-section">
            <div className="account-field">
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

            <div className="account-field">
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

            <div className="account-field">
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

            <div className="account-field">
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
              className="account-edit-btn"
              disabled={saving}
            >
              {isEditing ? (saving ? 'Saving...' : 'Save') : 'Edit'}
            </button>
          </div>
        </div>
        <div className='user-contribution'>{
          <YourContributions userId={accountId} />
        }
        </div>
      </div>

    </div>
  )
};

export default Account;

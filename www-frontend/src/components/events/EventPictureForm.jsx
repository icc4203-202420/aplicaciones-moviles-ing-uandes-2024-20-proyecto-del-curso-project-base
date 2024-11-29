import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button, TextField, CircularProgress, Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function EventPictureForm() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { eventName } = location.state || {};
  const [picture, setPicture] = useState(null);
  const [friends, setFriends] = useState([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [taggedFriends, setTaggedFriends] = useState([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('CURRENT_USER_ID');
    
    if (storedUserId) {
      setUserId(storedUserId);

      axios.get(`http://localhost:3001/api/v1/users/${storedUserId}`)
        .then((response) => {
          setFriends(response.data.friends);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    } else {
      console.error('CURRENT_USER_ID is not found in localStorage');
    }
  }, []);

  const handleFileChange = (e) => {
    setPicture(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append('event_picture[picture]', picture);
    formData.append('event_picture[description]', description);
    formData.append('event_picture[event_id]', id);
    formData.append('event_picture[user_id]', userId);
    formData.append('event_picture[tagged_friends]', JSON.stringify(taggedFriends));

    try {
      const response = await axios.post('http://localhost:3001/api/v1/event_pictures', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(`/events/${id}`);
    } catch (error) {
      console.error('Error uploading picture:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', marginBottom: '30px' }}>
        <IconButton onClick={handleBackClick}>
          <ArrowBackIosIcon sx={{ color: 'black', fontSize: '1.5rem', marginLeft: '-5rem' }} />
        </IconButton>
        <h2 style={{ margin: 0, color: 'black', fontSize: '1.5rem', fontWeight: 500 }}>
          {eventName ? `${eventName}` : 'Add Pictures to the Event'}
        </h2>
      </div>


        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <label htmlFor="upload-input" style={{ cursor: 'pointer' }}>
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '12px',
                backgroundColor: picture ? '#000' : 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.6)',
              }}
            >
              {picture ? (
                <img
                  src={URL.createObjectURL(picture)}
                  alt="Selected"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                />
              ) : (
                <AddIcon style={{ fontSize: '2rem', color: 'white' }} />
              )}
            </div>
          </label>
          <input
            id="upload-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <Autocomplete
            multiple
            id="tag-friends-autocomplete"
            options={friends} 
            getOptionLabel={(option) => option.handle} 
            value={taggedFriends}
            onChange={(event, newValue) => {
              setTaggedFriends(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Tag your friends"
                placeholder="Search by handle"
                sx={{marginTop: '20px'}}
              />
            )}
          />
        </div>

        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          value={description}
          onChange={handleDescriptionChange}
          sx={{ marginBottom: '20px'}}
        />

        <Button sx={{ background: 'linear-gradient(to right, #FFDB01, #FF8603)' }} variant="contained" type="submit" disabled={loading || !userId} fullWidth>
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </form>
    </>
  );
}

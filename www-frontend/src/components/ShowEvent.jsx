import axiosInstance from '../api/axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import './ShowEvent.css'
import { ConstructionOutlined } from '@mui/icons-material';

const formatDate = (dateString) => {
  if (dateString) {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-US', { day: 'numeric' });
    const month = date.toLocaleDateString('en-US', { month: 'long'});
    const hours = date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false});
    const minutes = date.toLocaleTimeString('en-US', { minute: '2-digit'});
    return `${month} ${day}, ${hours}:${minutes}`
  }
  else {
    return 'Loading...'
  }
};

function ShowEvent() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [friends, setFriends] = useState([]);
    const [attendants, setAttendants] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [friendNames, setFriendNames] = useState([]);
    const [otherAttendees, setOtherAttendees] = useState([]);
    const [file, setFile] = useState(null);
    const [flyerUrls, setFlyerUrls] = useState([]);
    const [flyerData, setFlyerData] = useState([]);
    const [date, setDate] = useState('Loading...(state)');
    const [imageTags, setImageTags] = useState('')

    const user = JSON.parse(localStorage.getItem('Tapp/Session/currentUser'));
    const token = localStorage.getItem('Tapp/Session/token').replace(/['"]+/g, '').replace('Bearer ', '');

    useEffect(() => {
        axiosInstance.get(`/users`)
            .then(res => setAllUsers(res.data.users))
            .catch(error => console.error('Error loading users data:', error));
    }, [])

    useEffect(() => {
        axiosInstance.get(`/events/${id}`)
            .then(res => {
              const eventData = res.data.event;
              setEvent(eventData);
              const eventDate = formatDate(eventData.date);
              setDate(eventDate);
              if (eventData.flyer_urls) {
                setFlyerUrls(eventData.flyer_urls);
                axiosInstance.get(`/events/${id}/event_pictures`)
                .then(res2 => {
                  const event_pictures_data = res2.data.event_pictures;
                  console.log(event_pictures_data);
                  setFlyerData([...event_pictures_data]);
                })
              }
            })
            .catch(error => console.error('Error loading event data:', error));
    }, [id, file]);

    useEffect(() => {
      console.log('flyerData updated:', flyerData);
    }, [flyerData]);

    useEffect(() => {
        axiosInstance.get(`/attendances/${id}`)
            .then(res => setAttendants(res.data.attendance))
            .catch(error => console.error('Error loading attendances data:', error));
    }, [id]);

    useEffect(() => {
        axiosInstance.get(`/users/${user.id}/friendships`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setFriends(res.data.friendships.map(friend => friend.friend_id));
        })
        .catch(error => {
            console.error('Error loading friends data:', error);
        });

    }, [token, user.id]);

    useEffect(() => {

        const friendIds = new Set(friends);
        const attendingUserIds = new Set(attendants.map(attendant => attendant.user_id));

        const filteredFriends = allUsers.filter(user => friendIds.has(user.id) && attendingUserIds.has(user.id));
        setFriendNames(filteredFriends);

        const otherAttendees = allUsers.filter(user => !friendIds.has(user.id) && attendingUserIds.has(user.id));
        setOtherAttendees(otherAttendees);

    }, [allUsers, friends, attendants]);

    const handleFileChange = (e) => {
      setFile(e.target.files);
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!file) return;
    
      const promises = Array.from(file).map(f => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
            resolve(`data:${f.type};base64,${base64String}`);
          };
          reader.onerror = reject;
          reader.readAsDataURL(f);
        });
      });
    
      Promise.all(promises)
        .then(base64Images => {
          axiosInstance.put(`/events/${id}`, {
            event: {
              image_base64: base64Images,
              user_id: user.id
            }
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(res => {
            alert('Images uploaded successfully');
            setFlyerUrls(res.data.event.flyer_urls);
            axiosInstance.get(`/events/${id}/event_pictures`)
              .then(res2 => {
                const event_pictures_data = res2.data.event_pictures;
                setFlyerData([...event_pictures_data]);
              })
              .catch(error => console.error('Error loading event pictures data:', error));
          })
          .catch(error => {
            console.error('Error uploading images:', error);
            alert('Error uploading images');
          });
        })
        .catch(err => console.error('Error processing images:', err));
    };

    const handleTags = (index) => {
      axiosInstance.post(`/events/${id}/event_pictures/${index}/tags`, {
        event_picture_id: index,
        user_id: user.id,
        tagged_user_id: 1}
      )
        .then(res => {
          const imageTags = res.data.tags;
          const tagsString = JSON.stringify(imageTags.filter(tag => tag.event_picture_id === index), null, 2);
          setImageTags(tagsString);
          
        })
    }

    if (!event) {
      return <div>Loading...</div>;
    }

    return (
      <div className='show-event-container'>
        <div className='show-event-name'>
          {event.name}
        </div>
        <div className='show-event-date'>
          {date}
        </div>
        <div className='show-event-desc'>
          {event.description}
        </div>
        <div className="show-event-attendees">
          {friendNames.length > 0 && (
            <div className='show-event-friends'>
              <div className='show-event-friends-header'>Friends Attending:</div>
              <div className="show-event-friends-list">
                <ul>
                  {friendNames.map(friend => (
                    <li key={friend.id}>{friend.first_name} {friend.last_name} - @{friend.handle}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {otherAttendees.length > 0 && (
            <div className="show-event-other">
              <div className='show-event-other-header'>People Attending:</div>
              <div className='show-event-other-list'>
                <ul>
                    {otherAttendees.map(person => (
                      <li key={person.id}>{person.first_name} {person.last_name} - @{person.handle}</li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        {flyerUrls.length > 0 && (
          <div className='show-event-flyer'>
            <h2 style={{ color: 'black' }}>Event Flyers</h2>
            {flyerUrls.map((url, index) => (
                flyerData.length > index && flyerData[index] && (
                  <div className='flyer' key={index}>
                    <div style={{color: 'black'}} className='flyer-header'>
                      @{allUsers.find((user) => user.id === flyerData[index].user_id)?.handle}
                    </div>
                    <img key={index} src={url} alt={`${event.name} flyer ${index + 1}`} />
                    <div className='tag-button'>
                      <form onSubmit={handleTags(index+1)}></form>
                      <button onClick={() => handleTags(index+1)}>Tag user</button>
                      {imageTags}
                    </div>
                    <div style={{color: 'black'}} className='flyer-footer'>{flyerData[index].description}</div>
                    <br />
                  </div>
                )
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Upload Image</button>
        </form>
      </div>
    );
}

export default ShowEvent;
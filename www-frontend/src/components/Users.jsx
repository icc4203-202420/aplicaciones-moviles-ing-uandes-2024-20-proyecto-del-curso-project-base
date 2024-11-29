import useAxios from 'axios-hooks';
import { useState, useEffect } from 'react';
import './Users.css';
import addFriend from '../assets/AddFriend';
import Friend from '../assets/Friend';
import axiosInstance from '../api/axios';
import useLocalStorageState from 'use-local-storage-state';

const ShowUsers = ({ data, option }) => {

  const currentUser = JSON.parse(localStorage.getItem('Tapp/Session/currentUser'));
  const [popUp, setPopUp] = useState({});
  const barsUrl = 'http://localhost:3001/api/v1/bars';
  const [{ data: bars }] = useAxios(barsUrl);
  const [ token ] = useLocalStorageState('Tapp/Session/token', {defaultValue: ''});
  const [ friends, setFriends ] = useState([]);
  const filteredData = option
    ? data.filter(user => user.handle.toLowerCase().includes(option.toLowerCase()))
    : data;

  const togglePopUp = (userId) => {
    setPopUp(prevState => ({
      ...prevState,
      [userId]: !prevState[userId]
    }));
  }

  useEffect(() => {
    axiosInstance.get(`/users/${currentUser.id}/friendships`, {
      headers: { Authorization: token }
    }).then(response => {
      setFriends(response.data.friendships.map(friend => friend.friend_id));
    }).catch(error => { console.log(error) });
  }, [token, currentUser.id]);
  
  return (
    <ul className='users-list'>
    {filteredData.map(user => (
      <li key={user.id} className='users-item'>
        <div className='users-name'>@{user.handle}</div> 
        <div>
          {friends.includes(user.id) ? ( <div>{Friend}</div> ) : ( <div  className='addFriend' onClick={() => togglePopUp(user.id) }>{addFriend}</div> )}
        </div>
        {popUp[user.id] && (
          <div className='popUp'>
            <div className='popUp-content'>
              <div className='close-popUp' onClick={() => togglePopUp(user.id)}>X</div>
              <h3>Where did you become friends?</h3>
              <ul>
                {bars.bars.map((bar, index) => (
                  <li key={index} onClick={() => {
                    axiosInstance.post(`/users/${currentUser.id}/friendships`, {
                      friend_id: user.id,
                      bar_id: bar.id
                    }, {
                      headers: { Authorization: token }
                    }).then(response => { console.log(response) })
                    .catch(error => { console.log(error) });
                    togglePopUp(user.id);
                    setFriends([...friends, user.id]);
                  }}>
                    {bar.name}
                  </li>
                ))}
              </ul>
              <div className='none-button' onClick={() => {
                    axiosInstance.post(`/users/${currentUser.id}/friendships`, {
                      friend_id: user.id,
                    }, {
                      headers: { Authorization: token }
                    }).then(response => { console.log(response) })
                    .catch(error => { console.log(error) });
                    togglePopUp(user.id);
                    setFriends([...friends, user.id]);
                  }}>None</div>
            </div>
          </div>
        )}
      </li>
    ))}
  </ul>
  );
}

const Users = () => {
  const apiUrl = 'http://localhost:3001/api/v1/users'
  const [{ data, loading, error }] = useAxios(apiUrl);
  const [selectedOption, setSelectedOption] = useState('');

  if (loading) return <div className='axios-state-message' id='loading-message'>Loading...</div>;
  if (error) return <div className='axios-state-message' id='loading-message'>Error loading data.</div>;

  const handleInputChange = (e) => {
    setSelectedOption(e.target.value);
  }

  return (
    <div className='users-container'>
      <div className='users-title'>Users</div>

      <div className='users-content'>
        <div className='users-list-container'>
          <input
              type="text"
              className="users-search"
              placeholder="Search a @user"
              value={selectedOption}
              onChange={handleInputChange}
          />
          <ShowUsers data={data?.users || []} option={selectedOption} />
        </div>

      </div>

    </div>
  );
}

export default Users;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getPersonneParId, getSocieteParId, load_user } from '../../actions/auth';
import './Conversation.css';

const Conversation = ({ data, currentUserId, online }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUserId);

    const getUserData = async () => {
      try {
        const { data } = await axios.get(`/admin/users/${userId}/`);
        setUserData(data);
        console.log(data);
        
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, []);

  return (
    <>
      <div className="follower conversation">
        <div className="follower-container">
          <div className="follower-details">
            <div className="follower-vertical">
              {online && <div className="online-dot"></div>}
              <img
              
                src={`/media/images/${userData?.societe?.logo || userData?.personne?.image || 'defaultProfile.png'}`}
                

                alt=""
                className="followerImage"
                style={{ width: '50px', height: '50px' }}
              />
            </div>
            <div className="follower-horizontal">
              <div className="name" style={{ fontSize: '0.8rem', color: 'white' }}>
                <span style={{color:'black'}}>{userData?.nom} {userData?.prenom}</span>
              </div>
              <div className="online">
                <span>{online? "En Ligne" : "Hors Ligne"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr style={{ width: '85%', border: '0.1px solid #ececec' }} />
    </>
  );
};

export default Conversation;

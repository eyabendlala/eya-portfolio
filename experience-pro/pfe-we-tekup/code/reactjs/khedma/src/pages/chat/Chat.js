import React, { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";
import { connect } from "react-redux";
import axios from "axios";
import Conversation from "./Conversation";
import LogoSearch from "./LogoSearch";
import ChatBox from "./ChatBox";
import { io } from "socket.io-client";
import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
import {Row, FormGroup, FormControl, Col} from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import "./Chat.css";
import { Navigate, useNavigate } from 'react-router-dom';
import RecruiterNavbar from '../../components/RecruiterNavbar';

function Chat({ id, isAuthenticated }) {
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  
  const socket = useRef();
  
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    socket.current = io("http://localhost:8800");
    socket.current.emit("new-user-add", id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [id]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await axios.get(`/userChats/${id}/`);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [id]);

  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      setReceivedMessage(data);
    });
  }, []);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };
  
  const [users, setUsers] = useState()
  useEffect(()=>{
    const fetchUsers = async (members) => {
      try {
          const response = await axios.get('/admin/users/');
          let users = []
          for (let member of members){
              let user = response.data.users.find(user => user.id === member)
              if(user.role === 'societe'){
                user = response.data.societes.find(societe => societe.user_id === member)
              }else{
                user = response.data.personnes.find(personne => personne.user_id === member)
              }
              users.push(user)
          }
          setUsers(users)
      } catch (error) {
          console.error('Error fetching users:', error);
      }
    };
    
    if (chats.length !== 0 && chats instanceof Array){
      let membersID = []
      for(let chat of chats){
        membersID.push(chat.members.find(member => member !== id))
      }
      if (membersID.length !== 0){
        fetchUsers(membersID)
      }
    }
  }, [chats])

  const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        const rows = document.getElementsByClassName('selected-row');
        if (rows.length !== 0){
            rows[0].className = ''
        }
    };
    
    let filteredChats;
    if(searchTerm !== ''){
      const searchTermLowerCase = searchTerm.toLowerCase();
      const searchTermParts = searchTermLowerCase.split(' ');
      const usersSearched = users.filter((user) => {
       // console.log(user)
        if (user.prenom !== undefined) {
          const fullName = `${user.nom.toLowerCase()} ${user.prenom.toLowerCase()}`;
          return searchTermParts.every((part) => fullName.includes(part));
        }else{
          const fullName = `${user.nom.toLowerCase()}`;
          return searchTermParts.every((part) => fullName.includes(part));
        }
      });

      let chatsSearched = []
      for(let user of usersSearched){
        chatsSearched.push(chats.find(chat => chat.members.find(member => (member !== id) && (member === user.user_id))))
      }
      filteredChats = chatsSearched
    }else{
      filteredChats = chats
    }

  const [currentChatView, setCurrentChatView] = useState('left');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
  
    // Add a listener for the window resize event
    window.addEventListener('resize', handleResize);
  
    // Initial check for screen width
    handleResize();
  
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(()=>{
    //console.log(currentChat)
  },[currentChat])
  if(!isAuthenticated){
    return <Navigate to="/login" />;
}

  return (
    <>
      {/* <Navbar /> */}
      {/* <RecruiterNavbar /> */}

      <Row className="page-container">

        {isSmallScreen === true && (
          <button className="toggleButton" onClick={() => setCurrentChatView(currentChatView === 'left' ? 'right' : 'left')}>
            <FontAwesomeIcon icon={faSyncAlt} size="lg" style={{"--fa-primary-opacity": "1",}} />
          </button>
        )}

        {(currentChatView === 'left' || !isSmallScreen) && (
          <Col md={4} className="left-side">
            <div style={{ marginTop: '-250px' }}>
              <div className="mt-2 mb-4" style={{fontWeight:'bold', color:'black',fontSize:'30px'}}>Discussions</div>
              <Row>
                <FormGroup>
                      <FormControl type="text"
                                  placeholder="Recherche..."
                                  onChange={handleSearchChange}
                                  style={{color:'black'}}
                      />
                  </FormGroup>
              </Row>
              <div>
                {Array.isArray(filteredChats) &&
                  filteredChats.map((chat) => (
                    <div key={chat.id} onClick={() => {
                        setCurrentChat(chat)
                        setCurrentChatView('right')
                      }}>
                      <Conversation
                        data={chat}
                        currentUserId={id}
                        online={checkOnlineStatus(chat)}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </Col>
        )}

        {/* Right Side - Chat Box */}
        {(currentChatView === 'right' || !isSmallScreen) && (
          <Col md={8} className="mt-2 mb-4">
              <ChatBox
                chat={currentChat}
                currentUser={id}
                setSendMessage={setSendMessage}
                receivedMessage={receivedMessage}
              />
          </Col>
        )}
        
      </Row>
      {/* <Footer /> */}
    </>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  role: state.auth.user && state.auth.user.role,
  id: state.auth.user && state.auth.user.id,
});

export default connect(mapStateToProps)(Chat);

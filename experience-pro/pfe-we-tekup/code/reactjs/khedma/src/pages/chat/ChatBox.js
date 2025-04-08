import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus , faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import { format } from 'timeago.js';
import InputEmoji from 'react-input-emoji';
import "./ChatBox.css"
import { Col, Row } from 'react-bootstrap';

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scroll = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState([]);

  useEffect(() => {
    if (receivedMessage !== null && receivedMessage?.chat === chat?.id) {
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]);

  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);

    const getUserData = async () => {
      try {
        const { data } = await axios.get(`/admin/users/${userId}/`);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) {
      getUserData();
    }
  }, [chat, currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (chat) {
          const { data } = await axios.get(`/get-messages/${chat.id}/`);
          setMessages(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [chat]);

  useEffect(() => {
    if (chat && messages.length > 0) {
      const filtered = messages.filter((message) => message.chat === chat.id);
      setFilteredMessages(filtered);
    }
  }, [chat, messages]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setFileSelected(true);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage && !selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('sender', currentUser);
    formData.append('text', newMessage || '');
    formData.append('chat', chat.id);

    if (selectedFile) {
      formData.append('file', selectedFile);
      setFileSelected(false);
    }

    try {
      const { data } = await axios.post(`/add-message/`, formData);
      setMessages([...messages, data]);
      setNewMessage('');
      setSelectedFile(null);
    } catch (error) {
      console.log(error);
    }

    const receiverId = chat.members.find((id) => id !== currentUser);

    const message = {
      sender: currentUser,
      text: newMessage,
      chat: chat.id,
      file: selectedFile ? selectedFile.name : null,
    };

    setSendMessage({ ...message, receiverId });
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <Row className='justify-content-md-center' style={{marginTop:'60px'}}>
        <Col md={12}>
          {chat ? (
            <>
              <div className="chat-body">
                <div className="chat-header">
                  <div className="follower-vertical">
                    <img
                      // src={`/${userData?.logo || 'defaultProfile.png'}`}
                      src={`/media/images/${userData?.societe?.logo || userData?.personne?.image || 'defaultProfile.png'}`}

                      alt=""
                      className="followerImage"
                      style={{ width: '50px', height: '50px' }}
                    />

                    <div className="follower-horizontal">
                      <div
                        className="nameChatBox"
                        style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}
                      >
                        <span>
                          {userData?.nom} {userData?.prenom}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />

                {filteredMessages.map((message) => (
                  <div
                    ref={scroll}
                    key={message.id}
                    className={message.sender === currentUser ? 'message own' : 'message sender'}
                  >
                    <span>{message.text}</span>
                    {message.file && (
                      <a href={`${message.file}`} download style={{ color: 'black' }}>
                        fichier
                      </a>
                    )}
                    <span>{format(message.created_at)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
              <span style={{display:'flex', justifyContent:'center', textAlign:'center'}}>Appuyez sur un chat pour démarrer la conversation...</span>
          )}
          <Row className="chat-sender">
            <Col md={12} style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
              <div className='chat'>
                <div className={`file-upload-icon ${fileSelected ? 'blue' : ''}`} onClick={() => fileInputRef.current.click()}>
                  <FontAwesomeIcon icon={faFolderPlus} />
                </div>

                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />

                <div className='inputSize'><InputEmoji className="custom-input-emoji" value={newMessage} onChange={handleChange} /></div>
                <button className="send-button" onClick={handleSend}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* chat-sender */}
      
    </>
  );
};

export default ChatBox;

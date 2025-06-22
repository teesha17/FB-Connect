import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate()

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      console.log("fetching")
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/webhook/all`,
        { headers: { 'token': `${token}` } }
      );
      setConversations(data.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err.message);
    }
  };

  console.log(selected)
  const sendReply = async () => {
    if (!message || !selected) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/webhook/reply_message`, {
        conversationId: selected._id,
        text: message,
      }, {
        headers: {
          'token': `${token}`
        }
      });

      setMessage('');

      // Refresh all conversations
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/webhook/all`,
        { headers: { 'token': `${token}` } }
      );

      setConversations(data.data);

      // Re-select the updated conversation
      const updated = data.data.find(c => c._id === selected._id);
      setSelected(updated || null);

    } catch (err) {
      console.error('Reply failed:', err.message);
    }
  };

  const disconnectFB = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/facebook/disconnect`, {}, {
        headers: { 'token': `${token}` }
      });
      navigate('/facebook/callback')
    } catch (err) {
      console.error('Disconnect failed:', err.message);
    }
  };

  const logout =  () =>{
    localStorage.clear();
    navigate('/login');
  }

  return (
    <div className="dashboard">
      <aside>
        <h3>Conversations</h3>
        {conversations.map((c, i) => (
          <div key={i} onClick={() => setSelected(c)} className="conversation-item">
            {c.participantName}
          </div>
        ))}
        <button onClick={disconnectFB} className="disconnect-btn">Disconnect FB</button>
        <button onClick={logout} className="logout-btn">Logout</button>
      </aside>
      <main>
        {selected ? (
          <>
            <h3>Chat with {selected.participantName}</h3>
            <div className="chat-box">
              {selected.messages?.map((m, i) => (
                <div key={i} className={`msg ${m.senderId === 'PAGE' ? 'sent' : 'received'}`}>{m.text}</div>
              ))}
            </div>
            <div className='input-btn'>
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type reply..."
              />
              <button className="send-btn" onClick={sendReply}>Send</button>
            </div>
          </>
        ) : <p>Select a conversation</p>}
      </main>
    </div>
  );
};

export default Dashboard;

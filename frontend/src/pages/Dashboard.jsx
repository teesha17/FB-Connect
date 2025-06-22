// JSX
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/webhook/all`,
        { headers: { 'token': `${token}` } }
      );
      setConversations(data.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err.message);
    }
  };

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

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/webhook/all`,
        { headers: { 'token': `${token}` } }
      );

      setConversations(data.data);
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
      navigate('/facebook/callback');
    } catch (err) {
      console.error('Disconnect failed:', err.message);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <aside>
        <div className="sidebar-header">
          <h3>Conversations</h3>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
        <div className="conversation-list">
          {conversations.map((c, i) => (
            <div
              key={i}
              onClick={() => setSelected(c)}
              className={`conversation-item ${selected?._id === c._id ? 'active' : ''}`}
            >
              <div className="conv-name">{c.participantName}</div>
              <div className="conv-snippet">{c.messages?.[c.messages.length - 1]?.text}</div>
            </div>
          ))}
        </div>
        <button onClick={disconnectFB} className="disconnect-btn">Disconnect FB</button>
      </aside>
      <main>
        {selected ? (
          <>
            <div className="chat-header">
              <h3>{selected.participantName}</h3>
            </div>
            <div className="chat-box">
              {selected.messages?.map((m, i) => (
                <div key={i} className={`msg ${m.senderId === 'PAGE' ? 'sent' : 'received'}`}>{m.text}</div>
              ))}
            </div>
            <div className='input-btn'>
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={`Message ${selected.participantName}`}
              />
              <button className="send-btn" onClick={sendReply}>Send</button>
            </div>
          </>
        ) : <p classname="message">Select a conversation</p>}
      </main>
      <section className="profile-section">
        {selected && (
          <div className="profile-card">
            <img src="https://scontent.fdel1-3.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_ohc=tsA5bu5AIm0Q7kNvwE38UiJ&_nc_oc=AdkrPLhKJ62MPPWrBlITumZS2krGWqEJFc0H--VP2iGrDfwA772PGjjIr3elzJDTyHM&_nc_zt=24&_nc_ht=scontent.fdel1-3.fna&edm=AP4hL3IEAAAA&oh=00_AfMd3Z9wqE_OTvhlvUnM6oKxcSUBmhSh6Dm3L0JXXEG7aw&oe=687F5719" alt={selected.participantName} className="profile-pic" />
            <h4>{selected.participantName}</h4>
            <p>Status: Offline</p>
            <div className="profile-actions">
              <button className="call-btn">📞 Call</button>
              <button className="profile-btn">👤 Profile</button>
            </div>
            <div className="profile-details">
              <h5>Customer details</h5>
              <p><strong>Email:</strong> {selected.email || 'N/A'}</p>
              <p><strong>First Name:</strong> {selected.participantName?.split(' ')[0]}</p>
              <p><strong>Last Name:</strong> {selected.participantName?.split(' ')[1] || ''}</p>
              <a href="#" className="view-more">View more details</a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;

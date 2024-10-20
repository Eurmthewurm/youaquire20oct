import React, { useState } from 'react';
import axios from 'axios';

const ClientForm = ({ ownerEmail, onClientAdded }) => {
  const [youtubeUsername, setYoutubeUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/clients', {
        email: ownerEmail,
        youtubeUsername,
      });
      setMessage(response.data.message);
      setYoutubeUsername('');
      onClientAdded(); // This should trigger a refresh of the client list
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to add client.');
      console.error(error);
    }
  };

  return (
    <div>
      <h3>Add Client</h3>
      <form onSubmit={handleAddClient}>
        <div>
          <label>YouTube Username:</label>
          <input
            type="text"
            value={youtubeUsername}
            onChange={(e) => setYoutubeUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Client</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ClientForm;

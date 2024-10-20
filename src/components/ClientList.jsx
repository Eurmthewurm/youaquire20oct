import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientList = ({ ownerEmail, refresh }) => {
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState('');

  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/clients', {
        params: { email: ownerEmail },
      });
      setClients(response.data.clients || []);
      setMessage('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to fetch clients.');
      console.error(error);
    }
  };

  useEffect(() => {
    if (ownerEmail) {
      fetchClients();
    }
  }, [ownerEmail, refresh]);

  return (
    <div>
      <h3>Your Clients</h3>
      {message && <p>{message}</p>}
      <ul>
        {Array.isArray(clients) ? (
          clients.map((client) => (
            <li key={client.id}>{client.youtubeUsername}</li>
          ))
        ) : (
          <li>No clients found</li>
        )}
      </ul>
    </div>
  );
};

export default ClientList;

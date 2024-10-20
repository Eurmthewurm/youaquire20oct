// src/App.js
import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import './App.css';

function App() {
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [refreshClients, setRefreshClients] = useState(false);

  const handleLogin = (email) => {
    setLoggedInEmail(email);
  };

  const handleClientAdded = () => {
    setRefreshClients(prev => !prev);
  };

  const handleRegister = () => {
    // Optionally, you can automatically log in the user after registration
  };

  return (
    <div className="App">
      <h1>Client Acquisition App</h1>
      {!loggedInEmail ? (
        <div>
          <Register onRegister={handleRegister} />
          <Login onLogin={handleLogin} />
        </div>
      ) : (
        <div>
          <p>Welcome, {loggedInEmail}!</p>
          <ClientForm ownerEmail={loggedInEmail} onClientAdded={handleClientAdded} />
          <ClientList ownerEmail={loggedInEmail} refresh={refreshClients} />
        </div>
      )}
    </div>
  );
}

export default App;

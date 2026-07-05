import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';

import './styles/global.css';

import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Dashboard
      onLogout={() => signOut(auth)}
    />
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
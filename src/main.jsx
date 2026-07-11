import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ParentPortal from './pages/parentPortal/parentPortal';
import './styles/global.css';

import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [parentSession, setParentSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  function handleLogout() {
    setParentSession(null);
    signOut(auth);
  }

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (parentSession) {
    return (
      <ParentPortal
        user={ parentSession }
        onLogout={handleLogout}
      />
    );
  }

  if (!user) {
    return <Login onParentLogin={setParentSession} />;
  }

  return (
    <Dashboard
      onLogout={handleLogout}
    />
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
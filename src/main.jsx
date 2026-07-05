import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./services/firebase";
import Login from "./pages/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import "./styles/global.css";

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (checking) {
    return (
      <div style={{ padding: "40px", textAlign: "center", direction: "rtl" }}>
        جاري التحميل...
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

createRoot(document.getElementById("root")).render(<App />);
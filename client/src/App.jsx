import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useContext } from "react"
import { useState } from "react"
import AuthContext from "./context/AuthContext"
import License from "./components/LicenseAgreement/License.jsx"
import Login from "./components/LogReg/Login.jsx"
import Register from "./components/LogReg/Register.jsx"
import Main from "./components/Main/Main.jsx"
import { Toaster } from "react-hot-toast";

function App() {
  const { user, loading } = useContext(AuthContext)
  const [toastPosition, setToastPosition] = useState("bottom-center");

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px'  }}>Завантаження...</div>;
  }

  return (
    <>
    <Toaster 
      position={toastPosition} 
      reverseOrder={false} 
      toastOptions={{
        style: {
          background: '#1f1b2b', 
          color: '#fff',
          borderRadius: '32px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          padding: '12px 16px',
        },
      }}
    />
    <Router>
      <Routes>
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/profile" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/profile" />} />
        <Route path="/profile" element={user ? <Main /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? "/profile" : "/login"} />} />

        <Route path="/license" element={<License />} />
      </Routes>
    </Router>
    </>
  );
}

export default App

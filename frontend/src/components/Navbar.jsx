import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('User decoded:', decoded);

      const userData = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        token: credentialResponse.credential
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', credentialResponse.credential);

      // Log login to backend
      const logData = {
        timestamp: new Date(),
        usuario: decoded.email,
        caducidad: new Date(decoded.exp * 1000), // exp is in seconds
        token: credentialResponse.credential
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/login-log`, logData);
      console.log('Login logged successfully');

    } catch (error) {
      console.error('Login failed or log recording failed', error);
    }
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-links">
          <Link to="/" className="nav-link">Inicio</Link>
          {user && (
            <>
              <Link to="/crear" className="nav-link">Crear Evento</Link>
              <Link to="/logs" className="nav-link">Logs</Link>
            </>
          )}
        </div>
        
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span style={{ fontWeight: 500 }}>Hola, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

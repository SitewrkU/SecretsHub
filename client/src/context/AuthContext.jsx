import { createContext, useState, useEffect, use } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const saveToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const removeToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.user);
        } catch (err) {
          removeToken();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);


  const register = async (name, password) => {
    try {
      const response = await axios.post('/api/auth/register', { name, password });
      const { token: newToken, user: newUser } = response.data;

      saveToken(newToken);
      setUser(newUser);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Помилка реєстрації' };
    }
  };

  const login = async (name, password) => {
    try {
      const response = await axios.post('/api/auth/login', { name, password });
      const { token: newToken, user: newUser } = response.data;

      saveToken(newToken);
      setUser(newUser);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Помилка входу' };
    }
  };


  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
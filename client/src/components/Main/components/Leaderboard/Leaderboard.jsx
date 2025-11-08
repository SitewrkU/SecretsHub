import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../../../context/AuthContext';
import toast from "react-hot-toast";
import { 
  Star
} from 'lucide-react';

import styles from './Leaderboard.module.css'

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get('/api/secrets/leaderboard');

      setUsers(response.data.leaderboard)
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Помилка отримання лідерборду');
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={styles.header}>
        <h1>
          Лідербоард
        </h1>
      </div>

      { users ? (
        <div className={styles.leaderboard}>
          {users.map(user => (

            <div key={user.rank} className={styles.userItem}>
              {user.rank} - {user.name} [{user.totalStars}]
            </div>

          ))}
        </div>
      ) : (
        dd
      )}
    
    </>
  )
}

export default Leaderboard
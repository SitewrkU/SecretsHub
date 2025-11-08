import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../../../context/AuthContext';
import toast from "react-hot-toast";
import { 
  HeartCrack,
  Star, 
  Calendar,
  TriangleAlert,
  CircleOff,
  HatGlasses,
 } from 'lucide-react';
import styles from './MySecrets.module.css';

const MySecrets = () => {
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchMySecrets();
  }, []);

  const fetchMySecrets = async () => {
    try {
      setLoading(true);

      const response = await axios.get('/api/secrets/my', 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSecrets(response.data.secrets);
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Помилка отримання секретів');
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div className={styles.header}>
        <h1>
          Ваші секрети
        </h1>
        <p>Секретів: {secrets.length}</p>
      </div>

      {secrets.length > 0 ? (
        <div className={`${styles.secretsList} ${styles.defScroll}`}>
          {secrets.map(secret => (

            <div key={secret.id} className={`${styles.secretItem} ${!secret.isActive ? styles.hiddenSecret : ''}`}>
              <div className={styles.mainInfo}>
                <h3 className={`${styles.title} ${styles.defScroll}`}>{secret.title}</h3>
                <span className={styles.date}><Calendar/> 
                  {new Date(secret.createdAt).toLocaleString('uk-UA', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</span>

              </div>
              <div className={styles.stats}>
                <span className={styles.stars}><Star/> {secret.starCount}</span>
                <span className={styles.reports}><TriangleAlert/> {secret.reportCount}</span>
                <span className={`${styles.showAuthor} ${!secret.showAuthor ? styles.showGrn : ''}`}><HatGlasses/></span>

                {!secret.isActive && (
                  <span className={styles.hiddenBadge}><CircleOff /></span>
                )}
              </div>
            </div>

          ))}
        </div>
      ) : (
        <div className={styles.preSecretLoader}>
          <p>Секретів не знайдено</p>
          <HeartCrack size={128} />
        </div>
      )}
    
    </>
  )
}

export default MySecrets
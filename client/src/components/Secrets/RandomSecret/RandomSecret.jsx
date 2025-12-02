import { useState, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import axios from "axios";
import { 
  Shuffle, 
  Ellipsis,
  Star, 
  Calendar,
  BadgeQuestionMark,
  TriangleAlert,
  HatGlasses,
 } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";
import styles from './RandomSecret.module.css';
import { isPostNew } from "../../../utils/DateUtils";

const RandomSecret = ({ secret, setSecret }) => {
  const [loading, setLoading] = useState(false);
  
  const { token } = useContext(AuthContext);

  const fetchRandomSecret = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/secrets/getRandom', 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSecret(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Помилка отримання секрету');
    } finally {
      setLoading(false);
    }
  }

  const toggleStar = async () => {
    if(!secret) return;

    try {
      const response = await axios.post(`/api/secrets/${secret.id}/star`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSecret(prev => ({
        ...prev,
        starCount: response.data.starCount,
        hasLiked: response.data.hasLiked
      }));

      console.log('Оновлено зірку успішно');
    } catch (err) {
      toast.error('Помилка оновлення зірки');
      console.error('Помилка оновлення зірки', err);
    }
  }

  const handleReport = async () => {
    try {
      const response = await axios.post(`/api/secrets/${secret.id}/report`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSecret(prev => ({
        ...prev,
        reportCount: response.data.reportCount,
        hasReported: response.data.hasReported
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Помилка репорту');
      console.error('Помилка репорту:', err);
    }
  }


  return (
    <div>
      <div>
        <div className={styles.header}>
          <h1>
            Шукати секрети...
          </h1>
        </div>


        {secret && (
          <div className={styles.secretCard}>
            <h2 className={`${styles.title} ${styles.defScroll}`}>
              {secret.title}
            </h2>

            <div className={styles.headerInfo}>
              <div className={`${styles.author} ${secret.author ? styles.hasUser : ''}`}>
                <HatGlasses size={16}/>
                {secret.author || 'Анон'}
              </div>
              <div className={styles.date}>
                <Calendar size={16} />
                {new Date(secret.createdAt).toLocaleDateString('uk-UA')}
                {isPostNew(secret.createdAt) && (
                  <span className={styles.newBadge}>НОВИЙ</span>
                )}
              </div>
            </div>

            <p className={`${styles.content} ${styles.defScroll}`}>
              {secret.content}
            </p>

            <div className={styles.actionContainer}>
              <button onClick={toggleStar} className={`${styles.actionButton} ${secret.hasLiked ? styles.liked : ''}`}>
                <Star size={20}/>
                <span>{secret.starCount}</span>
              </button>
              <button onClick={handleReport} className={`${styles.actionButton} ${styles.actionReport} ${secret.hasReported ? styles.reported : ''}`}>
                <TriangleAlert size={20}/>
                <span>{secret.reportCount || 0}</span>
              </button>
            </div>
          </div>
        )}


        {!secret && !loading && (
          <div className={styles.preSecretLoader}>
            <BadgeQuestionMark className={styles.preIcon} size={128} />
          </div>
        )}

        <button
          onClick={fetchRandomSecret}
          disabled={loading}
          className={styles.fetchButton}
        >
          {loading ? (
            <>
              <Ellipsis/>
            </>
          ) : (
            <>
              <Shuffle/>
            </>
          )}

        </button>
      </div>
    </div>
  );
};

export default RandomSecret;
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { User, Hash, Calendar, NotebookText, Star, TriangleAlert, LogOut, FilePlus2  } from "lucide-react"
import styles from './Profile.module.css'

const Profile = ({ onOpenModal }) => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Завантаження...</div>;
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Ви не авторизовані</h2>
        <button onClick={() => navigate('/login')}>Увійти</button>
      </div>
    );
  }
    
  const formatUserId = (id) => {
    return `${String(id).padStart(3, '0')}`;
  };

  return (
    <>
    <div className={styles.topContainer}></div>
    <div className={styles.profile}>
      <h1>Вітаю, {user.name}</h1>
      
      <div className={styles.stats}>
      <div className={styles.defStats}>
        <h2>Користувач</h2>
        <p><User/> {user.name}</p>
        <p><Hash/> {formatUserId(user.userId)}</p>
        {user.createdAt && (
          <p><Calendar/> {new Date(user.createdAt).toLocaleDateString('uk-UA')}</p>
        )}
      </div>

      <div className={[styles.defStats, styles.contentStats].join(' ')}>
        <h2>Активність</h2>
        <p><NotebookText/> {user?.stats?.totalSecrets ?? 0}</p>
        <p><Star/> {user?.stats?.totalStars ?? 0}</p>
        <p><TriangleAlert/> {user?.stats?.totalReports ?? 0}</p>
      </div>
      </div>

      <div className={styles.actionContainer}>
      <button className={styles.CreateSecretButton} onClick={onOpenModal}>
        <FilePlus2/>
      </button>
      <button onClick={handleLogout} className={styles.LogOutButton}>
        <LogOut/>
      </button>
      </div>
    </div>
    </>
  );
}

export default Profile;

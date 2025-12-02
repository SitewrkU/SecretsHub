import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { User, 
  Hash, 
  Calendar, 
  NotebookText, 
  Star, 
  TriangleAlert, 
  LogOut, 
  FilePlus2,
  BicepsFlexed,
} from "lucide-react"
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

      <div className={`${styles.defStats} ${styles.contentStats} ${styles.defScroll}`}>
        <h2>Активність</h2>
        <p><NotebookText/> {user?.stats?.totalSecrets ?? 0}</p>
        <p><Star/> {user?.stats?.totalStars ?? 0}</p>
        <p><TriangleAlert/> {user?.stats?.totalReports ?? 0}</p>
        <p><BicepsFlexed/> Вага репорту: {user ? getUserReportWeight(user) : '1.0'}</p>
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



function getUserReportWeight(user) {
  if (!user) return 1.0;
  let weight = 1.0;

  const day = (24 * 60 * 60 * 1000);
  const createdAt = new Date(user.createdAt).getTime();
  const accountAgeDays = (Date.now() - createdAt) / day;

  const { totalStars = 0, totalReports = 0 } = user.stats || {};

  if (accountAgeDays <= 3) weight -= 0.3;
  if (accountAgeDays > 15) weight += 0.1;
  if (accountAgeDays > 30) weight += 0.2;
  if (accountAgeDays > 90) weight += 0.2;
  
  if (totalStars > 20) weight += 0.1;
  if (totalStars > 50) weight += 0.2;
  if (totalStars > 100) weight += 0.2;
  
  if (totalReports > 30) weight -= 0.1;
  if (totalReports > 50) weight -= 0.3;
  
  return Math.max(weight, 0.3).toFixed(1);
}

export default Profile;

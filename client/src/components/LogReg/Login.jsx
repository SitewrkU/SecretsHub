import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { User, KeyRound, Eye, EyeOff } from "lucide-react"
import toast, { Toaster } from "react-hot-toast";
import styles from './LogReg.module.css'

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Перемикаємо стан
  };



  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!name || !password) {
      toast.error("Всі поля обов'язкові");
      return;
    }

    const result = await login(name, password);

    if (result.success) {
      navigate('/profile');
      toast.success("Вхід успішний!");
    } else {
      toast.error(result.message);
    }
  }


  return (
    <>
    <div className={styles.signContainer}>
      <h2>Вхід</h2>
      <p className={styles.haveAcc}>
        Немає акаунту? <a href="/register">Створити</a>
      </p>
      <form onSubmit={handleSubmit}>

        <div className={styles.inputBox}>
          <User />
          <input
            type="text"
            value={name}
            maxLength="15" 
            placeholder="Юзернейм"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className={[styles.inputBox, styles.passwordBox].join(' ')}>
          <KeyRound />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder="Пароль"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className={styles.eyeIcon} onClick={togglePasswordVisibility}>
            {showPassword ? <Eye /> : <EyeOff />}
          </span>
        </div>

        <button 
          type="submit"
        >
          Увійти
        </button>

      </form>
    </div>
    </>
  );
}

export default Login;
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { User, KeyRound, Eye, EyeOff, CheckSquare, Square } from "lucide-react"
import toast, { Toaster } from "react-hot-toast";
import styles from './LogReg.module.css'


const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Перемикаємо стан
  };



  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!name || !password) {
      toast.error("Всі поля мають бути заповнені");
      return;
    }
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(name)) {
      toast.error("Використовуйте лише англійські літери, цифри та підкреслення.");
      return;
    }
    if(name.length < 3 || name.length > 15) {
      toast.error("Ім'я має бути від 3 до 15 символів");
      return;
    }
    if(password.length < 6 || password.length > 64) {
      toast.error("Пароль має бути від 6 до 64 символів");
      return;
    }

    if (!agree) {
      toast.error("Ви повинні прийняти ліцензійну угоду");
      return;
    }


    const result = await register(name, password);
    if (result.success) {
      navigate('/profile');
      toast.success("Вхід успішний!");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <>
    <div className={styles.signContainer}>
      <h2>Реєстрація</h2>
      <p className={styles.haveAcc}>
        Вже є акаунт? <a href="/login">Увійти</a>
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
            maxLength="64"
            placeholder="Пароль"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className={styles.eyeIcon} onClick={togglePasswordVisibility}>
            {showPassword ? <Eye /> : <EyeOff />}
          </span>
        </div>

        <div className={styles.checkboxContainer}>
          <label className={styles.customCheckbox}>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              style={{ display: 'none' }}
            />
            <span className={styles.checkmark}>
              {agree ? <CheckSquare size={20} /> : <Square size={20} />}
            </span>
            <span className={styles.checkboxLabel}>
              Я погоджуюсь з{" "}
              <Link
                to="/license"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.licenseLink}
              >
                ліцензійною угодою
              </Link>
            </span>
          </label>
        </div>

        <button 
          type="submit"
          disabled={!agree} // ← кнопка неактивна без угоди
          className={!agree ? styles.disabledButton : ''}
        >
          Створити акаунт
        </button>

      </form>
    </div>
    </>
  );
}

export default Register;
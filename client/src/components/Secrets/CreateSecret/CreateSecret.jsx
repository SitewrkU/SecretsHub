import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { Send, Loader, CircleAlert, Square, CheckSquare  } from "lucide-react";
import axios from "axios";

import styles from "./CreateSecret.module.css";

const CreateSecret = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showAuthor, setShowAuthor] = useState(false);

  const [loading, setLoading] = useState(false);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(title.length < 3 || title.length > 100){
      toast.error("Заголовок має бути від 3 до 100 символів");
      return;
    }

    if(content.length < 10 || content.length > 10000){
      toast.error("Вміст секрету має бути від 10 до 10000 символів");
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/secrets', 
      {
        title,
        content,
        showAuthor
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTitle("");
      setContent("");
      toast.success("Секрет успішно створено!");
    } catch (err) {
      toast.error(err.response?.data?.message || 'Помилка створення секрету');
    } finally{
      setLoading(false);
    }
  }


  return (
    <>
      <div className={styles.createSecretContainer}>
        <h1>Поділіться секретом</h1>

        <form onSubmit={handleSubmit}>


          <div className={styles.checkboxContainer}>
            <label className={styles.customCheckbox}>
              <input
                type="checkbox"
                checked={showAuthor}
                onChange={(e) => setShowAuthor(e.target.checked)}
                style={{ display: 'none' }}
              />
              <span className={styles.checkmark}>
                {showAuthor ? <CheckSquare size={20} /> : <Square size={20} />}
              </span>
              <span className={styles.checkboxLabel}>
                Показати мій юзернейм разом із секретом
              </span>
            </label>
          </div>


          <div className={styles.inputGroup}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Заголовок секрету"
              maxLength={100}
            />
            <div className={`${styles.lengthLimit} ${title.length >= 100 ? styles.maxReached : ''}`}>
              {title.length}/100
            </div>
          </div>

          
          <div className={styles.inputGroup}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Розкажіть все що на душі..."
              rows={8}
              maxLength={10000}
            />
            <div className={`${styles.lengthLimit} ${content.length >= 10000 ? styles.maxReached : ''}`}>
              {content.length}/10000
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? (
              <>
                <Loader/>
              </>
            ) : (
              <>
                <Send/>
              </>
            )}
          </button>

          <div className={styles.publishWarning}>
            <CircleAlert className={styles.alertIcon}/>
            <p> 
              Перед публікацією впевніться що ваш секрет відповідає всім правилам нашого Сервісу. 
              Правила можна переглянути у 
              <Link
                to="/license"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.licenseLink}
              >
                Ліцензійній Угоді.
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  )
};


export default CreateSecret;
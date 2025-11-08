import { 
  Shuffle,
  NotebookText,
  ChartColumn
 } from "lucide-react"
import styles from './Navbar.module.css'

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className={styles.navbar}>
      <button
        onClick={() => setActiveTab("secret")}
        className={`${activeTab === "secret" ? styles.active : ''} ${styles.navButton}`}
      >
        <Shuffle />
      </button>

      <button
        onClick={() => setActiveTab("mySecrets")}
        className={`${activeTab === "mySecrets" ? styles.active : ''} ${styles.navButton}`}
      >
        <NotebookText />
      </button>


      <button
        onClick={() => setActiveTab("leaderboard")}
        className={`${activeTab === "leaderboard" ? styles.active : ''} ${styles.navButton}`}
      >
        <ChartColumn />
      </button>
    </nav>
  )
}

export default Navbar
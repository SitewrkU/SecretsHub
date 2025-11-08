import { useState } from "react"
import Profile from "../Profile/Profile"
import RandomSecret from "../Secrets/RandomSecret/RandomSecret"
import CreateSecret from "../Secrets/CreateSecret/CreateSecret"
import MySecrets from "./components/MySecrets/MySecrets"
import Leaderboard from "./components/Leaderboard/Leaderboard"
import Modal from "../Modal/Modal"
import Navbar from "./Navbar/Navbar"

const Main = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [currentSecret, setCurrentSecret] = useState(null);

  const openModal = () => setIsOpen(true);

  return (
    <>
      <Modal open={isOpen} onOpenChange={setIsOpen} title="Створити секрет">
        <CreateSecret />
      </Modal>
      <Profile onOpenModal={openModal} />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        {activeTab === "secret" &&
         <RandomSecret secret={currentSecret} setSecret={setCurrentSecret}/>
         }
        {activeTab === "mySecrets" && <MySecrets />}
        {activeTab === "leaderboard" && <Leaderboard />}
      </div>
    </>
  )
}

export default Main
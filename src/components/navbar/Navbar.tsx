import { useState } from "react";
import { Link } from "react-router-dom"
import { Person } from "@mui/icons-material";

import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { logIn, logOut } from "../../auth";

import "./Navbar.css"
import stethoscopeLogo from "./stethoscope.svg"


export function Navbar() {
  const [userName, setUserName] = useState<string | undefined>(undefined);

  onAuthStateChanged(auth, (user) => {
    setUserName(user?.displayName ?? undefined);
  });

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={stethoscopeLogo} alt="Logo"/>
        </Link>
      </div>
      <ul>
        <li><Link to="/" className="Link">Harmonogram</Link></li>
        <li><Link to="/about" className="Link">O nas</Link></li>
      </ul>
      <div className="user-info">
        {userName != null ?
          <>
            <div className="flexv">
              <p>{userName}</p>
              <span className="login" onClick={logOut}>Wyloguj się</span>
            </div>
            <Person className="profile-icon"/>
          </>
          :
          <>
            <span className="login" onClick={logIn}>Zaloguj się</span>
          </>
        }        
      </div>
    </nav>
  )
}
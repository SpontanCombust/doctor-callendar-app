import { useState } from "react";
import { Link } from "react-router-dom"

import "./Navbar.css"
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { logIn, logOut } from "../../auth";


export function Navbar() {
  const [userName, setUserName] = useState<string | undefined>(undefined);

  onAuthStateChanged(auth, (user) => {
    setUserName(user?.displayName ?? undefined);
  });

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/" className="Link">Kalendarz</Link></li>
        <li><Link to="/about" className="Link">O nas</Link></li>
      </ul>
      <div className="user-info">
        {userName != null ?
          <>
            <p>{userName}</p>
            <span className="login" onClick={logOut}>Wyloguj się</span>
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
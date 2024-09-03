import { Link } from "react-router-dom"

import "./Navbar.css"


export function Navbar() {


  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/" className="Link">Kalendarz</Link></li>
        <li><Link to="/about" className="Link">O nas</Link></li>
      </ul>
      <div className="user-info">
        <p>Name Surname</p>
        <a href="#">Log out</a>
      </div>
    </nav>
  )
}
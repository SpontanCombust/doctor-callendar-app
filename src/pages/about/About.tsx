import { Navbar } from "../../components/navbar/Navbar"

import "./About.css"
import reactLogo from "./react-logo.svg"
import firebaseLogo from "./firebase-logo.svg"


export function About() {
  return (<>
    <Navbar/>
    <div className="about">
      <div className="flexh center">
        <img src={reactLogo} alt="React" className="react-logo"/>
        <img src={firebaseLogo} alt="Firebase" className="firebase-logo"/>
      </div>
      <h2>Aplikacja wykonana dzięki bibliotece React i platformie Firebase</h2>
      <h2>Copyright &copy; 2024 Przemysław Cedro</h2>
    </div>
  </>)
}
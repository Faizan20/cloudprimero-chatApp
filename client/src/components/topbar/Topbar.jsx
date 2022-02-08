import "./topbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


export default function Topbar() {
  const {username} = useContext(AuthContext);
  const logout = () => {
    localStorage.clear();
    window.location.href = 'http://localhost:3000/login';
  }
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">ChatApp</span>
        </Link>
      </div>
      <div className="topbarRight">
        <button href="#" onClick={logout}>{username}: LOGOUT</button>
      </div>
    </div>
  );
}

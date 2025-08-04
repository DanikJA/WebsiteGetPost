import "./Header.scss";
import Logo from "./assets/Logo.svg";

const Header = ({ onUsersClick, onSignUpClick }) => {
  return (
    <header className="header">
      <img src={Logo} alt="Logo" className="logo" />
      <div className="nav">
        <button className="btn" onClick={onUsersClick}>
          Users
        </button>
        <button className="btn" onClick={onSignUpClick}>
          Sign up
        </button>
      </div>
    </header>
  );
};

export default Header;

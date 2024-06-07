import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  toggleModal: (show: any) => void;
  numOfContacts: number;
}

const Header = ({ toggleModal, numOfContacts }: Props) => {
  // const userName = localStorage.getItem('user');
  const userName = localStorage.getItem('user') ? localStorage.getItem('user') : null;
  const navigate = useNavigate();
  // console.log(localStorage.getItem('user'));
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return null;
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-left">
          <h3>Contact List ({numOfContacts})</h3>
        </div>
        <div className="header-center">
          <button onClick={toggleModal} className={userName ? "btn" : "disabled"}>
            <i className="bi bi-plus-square"></i> Add New Contact
          </button>
        </div>
        <div className="header-right">
          {userName ? (
            <div>
              <span>Hi, {userName}</span>
              <button onClick={handleLogout} className="btn">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="btn">
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

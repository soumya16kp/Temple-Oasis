import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEllipsisV, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import './header.css';

export default function Header() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return isMobile ? <MobileHeader /> : <DesktopHeader />;
}

function DesktopHeader() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
  ];

  return (
    <header className="header desktop-header">
      <div className="brand" onClick={() => navigate("/")}>
        Temple Oasis
      </div>
      <nav className="nav-container">
        <ul className="nav-links">
          {navItems.map(
            (item) =>
              item.active && (
                <li key={item.name} className="nav-item">
                  <button
                    onClick={() => navigate(item.slug)}
                    className="nav-button"
                  >
                    {item.name}
                  </button>
                </li>
              )
          )}
          {authStatus && (
            <li className="nav-item">
              <button
                className="nav-button account-button"
                onClick={() => navigate("/account")}
                title="Account"
              >
                <FontAwesomeIcon icon={faUser} />
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

function MobileHeader() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
  ];

  return (
    <header className="header mobile-header">
      <div className="brand">
        Temple Oasis
        <button
          className="mobile-menu-toggle"
          onClick={() => setOpen(!open)}
        >
          <FontAwesomeIcon icon={open ? faTimes : faEllipsisV} />
        </button>
      </div>
      {open && (
        <nav className="nav-container">
          <ul className="nav-links">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name} className="nav-item">
                    <button
                      onClick={() => {
                        navigate(item.slug);
                        setOpen(false);
                      }}
                      className="nav-button"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}
            {authStatus && (
              <li className="nav-item">
                <button
                  className="nav-button account-button"
                  onClick={() => {
                    navigate("/account");
                    setOpen(false);
                  }}
                  title="Account"
                >
                  <FontAwesomeIcon icon={faUser} />
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}

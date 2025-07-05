import './header.css';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


function Header() {
    const authStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();

    const navItems = [
        { name: "Home", slug: "/", active: true },
        { name: "Login", slug: "/login", active: !authStatus },
        { name: "Signup", slug: "/signup", active: !authStatus },
    ];

    return (
        <header className="header">
            {/* Left Side - Brand */}
            <div className="brand" onClick={() => navigate("/")}>
                Temple Oasis
            </div>

            {/* Right Side - Navigation */}
            <nav>
                <ul className="nav-links">
                    {navItems.map((item) =>
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
                        <>
                            <li className="nav-item">
                                <button
                                    className="nav-button account-button"
                                    onClick={() => navigate("/account")}
                                    title="Account"
                                >
                                <FontAwesomeIcon icon={faUser} />
                                </button>
                            </li>

                            
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;

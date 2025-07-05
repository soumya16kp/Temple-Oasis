
import './footer.css';
import { FaFacebookF, FaInstagram, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Brand */}
        <div className="footer-brand">
          <h2>Temple Oasis</h2>
          <p>Bringing peace, devotion, and community together.</p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Trustees</a>
          <a href="#">Gallery</a>
          <a href="#">Contact</a>
        </div>

        {/* Social Icons */}
        <div className="footer-social">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaEnvelope /></a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Temple Oasis. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

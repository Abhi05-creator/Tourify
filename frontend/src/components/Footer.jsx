import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-section">
            <Link to="/" className="nav-brand footer-brand">Tourify</Link>
            <p className="footer-text">
              Crafting unforgettable journeys and premium travel experiences since 2024. Your adventure starts here.
            </p>
          </div>
          
          <div>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/">Careers</Link></li>
              <li><Link to="/">Press</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><Link to="/">Contact Us</Link></li>
              <li><Link to="/">Help Center</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Follow Us</h4>
            <ul className="footer-links">
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Facebook</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Tourify Inc. All rights reserved. Designed for explorers.</p>
        </div>
      </div>
    </footer>
  );
}

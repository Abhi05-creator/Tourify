import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TourDetail from './pages/TourDetail';
import './index.css';

function App() {
  const token = localStorage.getItem('jwt');

  return (
    <Router>
      <nav className="nav">
        <Link to="/" className="nav-brand">Tourify</Link>
        <div className="nav-links">
          <Link to="/">All Tours</Link>
          {token ? (
            <span style={{ marginLeft: '1rem', color: 'var(--primary)', fontWeight: 600 }}>Logged In</span>
          ) : (
            <>
              <Link to="/login" style={{ marginLeft: '1rem', color: 'var(--text)', fontWeight: 500 }}>Log In</Link>
              <Link to="/signup" className="btn btn-outline" style={{ marginLeft: '1rem', padding: '0.4rem 0.8rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      </nav>
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tour/:id" element={<TourDetail />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

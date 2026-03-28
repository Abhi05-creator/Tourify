import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
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
            <Link to="/login" className="btn btn-outline" style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>Log In</Link>
          )}
        </div>
      </nav>
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tour/:id" element={<TourDetail />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

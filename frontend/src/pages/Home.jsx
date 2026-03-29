import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TOUR_IMAGES = {
  'the-forest-hiker': '/tour-forest-hiker.png',
  'the-sea-explorer': '/tour-sea-explorer.png',
  'snow-world': '/tour-snow-adventure.png',
  'the-city-wanderer': '/tour-city-wanderer.png',
  'the-park-camper': '/tour-park-camper.png',
  'the-sports-lover': '/tour-sports-lover.png',
  'the-wine-taster': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
  'taj-mahal': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800',
  'eiffel-tower': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=800',
  'the-great-pyramids': 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&q=80&w=800',
};

const formatName = (name) => name.replace(/-/g, ' ').toUpperCase();

const getImage = (tour) => {
  const name = tour.name ? tour.name.toLowerCase() : '';
  if (tour.imageCover) {
    return tour.imageCover.startsWith('http') ? tour.imageCover : `/${tour.imageCover}`;
  }
  if (TOUR_IMAGES[name]) return TOUR_IMAGES[name];
  return 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=80&w=800';
};

export default function Home() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('jwt');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/tours');
        setTours(response.data.data.tours || []);
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [location.key]);

  const handleDetails = (tourId) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate(`/tour/${tourId}`);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-badge">Your Next Adventure Starts Here</div>
          <h1>See the World Differently with Tourify</h1>
          <p>We don't just sell trips — we create stories worth telling. Every destination, every guide, every moment is chosen to move you.</p>
          <div className="hero-btns" style={{marginTop: '2rem'}}>
            <a href="#tours" className="btn">Browse Tours</a>
            <a href="#features" className="btn btn-outline" style={{marginLeft: '1rem'}}>Why Tourify?</a>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Built for Real Travelers</h2>
            <p className="section-subtitle">No cookie-cutter itineraries. No crowded buses. Just genuine experiences, thoughtfully designed.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Local-Led Journeys</h3>
              <p>Every tour is led by people who were born and raised where you're going — not just someone who read the guidebook.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Travel With Confidence</h3>
              <p>All operators are rigorously vetted. Your safety, comfort, and peace of mind are never an afterthought.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Always By Your Side</h3>
              <p>From booking to your last day back home, our team is available around the clock — because travel doesn't follow a schedule.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Book in Minutes</h3>
              <p>No back-and-forth emails, no waiting days for confirmation. Reserve your spot instantly and get ready to go.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="tours" className="container" style={{paddingTop: '4rem'}}>
        <div className="section-header">
          <h2 className="section-title">Explore Our Tours</h2>
          <p className="section-subtitle">
            {isLoggedIn
              ? 'Click any tour to see full details, itineraries, and booking options.'
              : 'Sign in to unlock full tour details, itineraries, and booking.'}
          </p>
        </div>
        <div className="grid">
          {tours.map((tour) => (
            <div className="card" key={tour._id}>
              <img
                src={getImage(tour)}
                alt={tour.name}
                className="card-img"
              />
              <div className="card-content">
                <div className="card-meta">
                  <span>{tour.difficulty} · {tour.duration}-day tour</span>
                  <span>{tour.ratingsAverage} ⭐ ({tour.ratingsQuantity})</span>
                </div>
                <h3 className="card-title">{formatName(tour.name)}</h3>
                <p style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem'}}>
                  {tour.summary}
                </p>
                <div className="card-footer">
                  <div className="card-price">
                    ${tour.price} <span>/ person</span>
                  </div>
                  <button onClick={() => handleDetails(tour._id)} className="btn">
                    {isLoggedIn ? 'Details' : 'Login to View'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to go somewhere remarkable?</h2>
            <p>Create a free account and unlock full access to all tours, itineraries, pricing, and instant booking.</p>
            <Link to="/signup" className="btn btn-large">Create Your Account</Link>
          </div>
        </div>
      </section>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

// Maps tour names to locally generated images
const TOUR_IMAGES = {
  'The Forest Hiker': '/tour-forest-hiker.png',
  'The Sea Explorer': '/tour-sea-explorer.png',
  'Snow World': '/tour-snow-adventure.png',
  'The City Wanderer': '/tour-city-wanderer.png',
  'The Park Camper': '/tour-park-camper.png',
  'The Sports Lover': '/tour-sports-lover.png',
  'The Wine Taster': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
  'Taj Mahal': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800',
  'Eiffel Tower': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=800',
  'The Great Pyramids': 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&q=80&w=800',
};

const getImage = (name) => TOUR_IMAGES[name] || 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=80&w=800';

export default function Home() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/tours');
        // Structure is standard JS/Express response { data: { tours: [...] } }
        setTours(response.data.data.tours || []);
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [location.key]);

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-badge">Curated Experiences</div>
          <h1>Adventure Awaits with Tourify</h1>
          <p>The world's most luxurious, curated travel experiences. We hand-pick every tour to ensure unforgettable memories and premium comfort.</p>
          <div className="hero-btns" style={{marginTop: '2rem'}}>
            <a href="#tours" className="btn">Explore Tours</a>
            <a href="#features" className="btn btn-outline" style={{marginLeft: '1rem'}}>Why Us?</a>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Tourify?</h2>
            <p className="section-subtitle">We go above and beyond to provide the best travel experiences.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>Expert Guides</h3>
              <p>Our guides are local experts who know the hidden gems and secret paths.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Safe & Secure</h3>
              <p>Your safety is our priority. We partner only with verified, high-quality operators.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Premium Support</h3>
              <p>24/7 support for all our travelers. We're here to help you every step of the way.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✈️</div>
              <h3>Seamless Booking</h3>
              <p>Book your next adventure in minutes with our fast and easy reservation system.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="tours" className="container" style={{paddingTop: '4rem'}}>
        <div className="section-header">
          <h2 className="section-title">Popular Tours</h2>
          <p className="section-subtitle">Discover our most booked and highly rated experiences.</p>
        </div>
        <div className="grid">
          {tours.map((tour) => (
            <div className="card" key={tour._id}>
              {/* Fallback to online image if local not found via public */}
              <img 
                src={getImage(tour.name)}
                alt={tour.name} 
                className="card-img" 
              />
              <div className="card-content">
                <div className="card-meta">
                  <span>{tour.difficulty} {tour.duration}-day tour</span>
                  <span>{tour.ratingsAverage} ⭐ ({tour.ratingsQuantity})</span>
                </div>
                <h3 className="card-title">{tour.name}</h3>
                <p style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem'}}>
                  {tour.summary}
                </p>
                <div className="card-footer">
                  <div className="card-price">
                    ${tour.price} <span>/ person</span>
                  </div>
                  <Link to={`/tour/${tour._id}`} className="btn">Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to start your journey?</h2>
            <p>Join thousands of happy travelers and discover the unseen beauty of the world.</p>
            <Link to="/login" className="btn btn-large">Get Started Now</Link>
          </div>
        </div>
      </section>
    </>

  );
}

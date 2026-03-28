import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

// Maps tour names to specific fallback/external images (sync with Home.jsx)
const TOUR_IMAGES = {
  'the-forest-hiker': '/tour-forest-hiker.png',
  'the-sea-explorer': '/tour-sea-explorer.png',
  'snow-world': '/tour-snow-adventure.png',
  'the-city-wanderer': '/tour-city-wanderer.png',
  'the-park-camper': '/tour-park-camper.png',
  'the-sports-lover': '/tour-sports-lover.png',
  'the-wine-taster': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
  'taj-mahal': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
  'eiffel-tower': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800',
  'the-great-pyramids': 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&q=80&w=800',
};

const getImage = (tour) => {
  const name = tour.name ? tour.name.toLowerCase() : '';
  if (tour.imageCover && tour.imageCover.startsWith('http')) return tour.imageCover;
  if (TOUR_IMAGES[name]) return TOUR_IMAGES[name];
  if (tour.imageCover) return `/${tour.imageCover}`;
  return 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=80&w=800';
};

export default function TourDetail() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(`/api/v1/tours/${id}`);
        setTour(response.data.data.tour);
      } catch (err) {
        console.error('Error fetching tour:', err);
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    fetchTour();
  }, [id]);

  if (loading) return <div className="spinner"></div>;
  if (!tour) return (
    <div className="container" style={{marginTop: '8rem', textAlign: 'center', minHeight: '60vh'}}>
      <h2>Tour not found.</h2>
      <Link to="/" className="btn" style={{marginTop:'2rem'}}>Go Back to Exploration</Link>
    </div>
  );

  return (
    <div className="animate-in">
      <section className="detail-hero" style={{ '--hero-url': `url(${getImage(tour)})` }}>
        <div className="container">
          <div className="hero-badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
            Featured Experience
          </div>
          <h1>{tour.name}</h1>
          <p style={{ maxWidth: '800px', margin: '0 0 2rem' }}>{tour.summary}</p>
        </div>
      </section>

      <div className="container">
        <div className="detail-grid">
          <main className="detail-main">
            <img src={getImage(tour)} alt={tour.name} className="detail-img" />
            
            <div className="detail-body">
              <h2 className="detail-section-title"><span>📍</span> Quick Facts</h2>
              <div className="info-card-grid">
                <div className="info-item">
                  <h4>Difficulty</h4>
                  <p style={{ textTransform: 'capitalize' }}>{tour.difficulty}</p>
                </div>
                <div className="info-item">
                  <h4>Duration</h4>
                  <p>{tour.duration} Days</p>
                </div>
                <div className="info-item">
                  <h4>Group Size</h4>
                  <p>Max {tour.maxGroupSize} people</p>
                </div>
                <div className="info-item">
                  <h4>Rating</h4>
                  <p>{tour.ratingsAverage} ⭐ / 5</p>
                </div>
              </div>

              <h2 className="detail-section-title"><span>📖</span> Description</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', whiteSpace: 'pre-line' }}>
                {tour.description}
              </p>
            </div>
          </main>

          <aside>
            <div className="booking-card">
              <h3>Start your journey</h3>
              <div className="booking-price">
                ${tour.price} <span>/ person</span>
              </div>
              <button className="btn" style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem' }}>
                Reserve This Tour
              </button>
              <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Free cancellation up to 48 hours before the start date.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


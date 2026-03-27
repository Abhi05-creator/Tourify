import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TOUR_IMAGES = {
  'The Forest Hiker': '/tour-forest-hiker.png',
  'The Sea Explorer': '/tour-sea-explorer.png',
  'Snow World': '/tour-snow-adventure.png',
  'The City Wanderer': '/tour-city-wanderer.png',
  'The Park Camper': '/tour-park-camper.png',
  'The Sports Lover': '/tour-sports-lover.png',
  'The Wine Taster': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
};

const getImage = (name) => TOUR_IMAGES[name] || 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=80&w=800';

export default function TourDetail() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/tours/${id}`);
        setTour(response.data.data.tour);
      } catch (err) {
        console.error('Error fetching tour:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  if (loading) return <div className="spinner"></div>;
  if (!tour) return <div className="container" style={{marginTop: '4rem', textAlign: 'center'}}><h2>Tour not found.</h2><Link to="/" className="btn" style={{marginTop:'1rem'}}>Go Back</Link></div>;

  return (
    <>
      <section className="hero" style={{ padding: '4rem 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem' }}>{tour.name}</h1>
          <p>{tour.summary}</p>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: '6rem' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <img 
            src={getImage(tour.name)} 
            alt={tour.name} 
            style={{ width: '100%', height: '400px', objectFit: 'cover' }} 
          />
          <div style={{ padding: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
              
              <div style={{ flex: '1 1 400px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>About The Tour</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Difficulty</h4>
                    <p style={{ fontSize: '1.25rem', fontWeight: 600, textTransform: 'capitalize' }}>{tour.difficulty}</p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Duration</h4>
                    <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{tour.duration} Days</p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Group Size</h4>
                    <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>Max {tour.maxGroup}</p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Rating</h4>
                    <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{tour.ratingsAverage} / 5</p>
                  </div>
                </div>
              </div>

              <div style={{ flex: '1 1 300px', background: 'var(--bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Book this tour</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>
                  ${tour.price} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ person</span>
                </div>
                <button className="btn" style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}>Reserve Now</button>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

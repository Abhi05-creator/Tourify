import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
};

const getImage = (name) => TOUR_IMAGES[name] || 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=80&w=800';

export default function Home() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/tours');
        // Structure is standard JS/Express response { data: { tours: [...] } }
        setTours(response.data.data.tours || []);
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Discover The Unseen</h1>
          <p>Premium, curated experiences for the modern explorer. Book your next adventure with Natours.</p>
        </div>
      </section>

      <section className="container">
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
    </>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
        return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/v1/users/signup', {
        name,
        email,
        password,
        confirmPassword
      });

      if (response.data.status === 'fulfilled') {
        // Save JWT
        localStorage.setItem('jwt', response.data.token);
        // Redirect to Home
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSignup}>
        <h2>Join Tourify</h2>
        
        {error && <div style={{color: '#ff4444', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center'}}>{error}</div>}
        
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name" 
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p style={{marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)'}}>
            Already have an account? <Link to="/login" style={{color: 'var(--primary)', fontWeight: 600}}>Log In</Link>
        </p>
      </form>
    </div>
  );
}

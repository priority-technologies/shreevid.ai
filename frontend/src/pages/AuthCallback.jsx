import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get token from URL hash
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      // Redirect to login with error
      navigate('/login?error=' + error);
      return;
    }

    if (token) {
      // Fetch user data with token
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          // Store token and user data
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Redirect to dashboard
          navigate('/dashboard');
        })
        .catch(err => {
          console.error('Failed to fetch user data:', err);
          navigate('/login?error=auth_failed');
        });
    } else {
      // No token, redirect to login
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      color: '#fff'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(255,255,255,0.3)',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <p>Completing sign in...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

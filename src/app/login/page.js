'use client';
import { useState, useEffect } from 'react';
import './login.scss';
import { useRouter } from 'next/navigation';
import { fnRemoveTokenFromLocalStorage, fnSaveTokenToLocalStorage } from '@/utils/local';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fnRemoveTokenFromLocalStorage();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });

    // Clear error when user types
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Make an API call to the login endpoint
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Set login success state
          setLoginSuccess(true);
          // Save the token to local storage
          fnSaveTokenToLocalStorage(data.token);
          // Wait for 1 second before redirecting
          setTimeout(() => {
            router.push('/'); // Redirect to dashboard after login
          }, 1000);
        } else {
          // Failed login with error message from API
          setErrors({ general: data.message || 'Login failed. Please try again.' });
        }
      } catch (error) {
        console.error('Login error:', error);
        setErrors({ general: 'Login failed. Please check your connection and try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // For the animated background effect
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // Create animated bubbles in the background
    const generateBubbles = () => {
      const newBubbles = [];
      for (let i = 0; i < 20; i++) {
        newBubbles.push({
          id: i,
          left: Math.random() * 100 + '%',
          size: Math.random() * 40 + 10,
          opacity: Math.random() * 0.3 + 0.1, // More subtle opacity
          duration: Math.random() * 15 + 10 + 's',
          delay: Math.random() * 5 + 's',
          color: ['#ff80ab', '#ffb2cc', '#c94f7c'][Math.floor(Math.random() * 3)] // Pink palette
        });
      }
      setBubbles(newBubbles);
    };
    generateBubbles();
  }, []);

  // Realtime clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Format time to display hours, minutes, and seconds only
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="login-container">
      <div className="bubbles-container">
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            className="bubble"
            style={{
              left: bubble.left,
              width: bubble.size + 'px',
              height: bubble.size + 'px',
              opacity: bubble.opacity,
              animationDuration: bubble.duration,
              animationDelay: bubble.delay,
              backgroundColor: bubble.color,
              boxShadow: `0 0 10px ${bubble.color}, 0 0 20px ${bubble.color}`
            }}
          ></div>
        ))}
      </div>

      <div className="login-form">
        <div className='login-body'>
          <div className='login-header'>
            <img src="/images/logo.png" className='logo' />
            <div className='login-title'>ROS</div>
          </div>
          <div className='form-content'>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? 'error' : ''}
                  autoComplete='off'
                  required
                />
                {errors.username && <div className="error-message">{errors.username}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete='off'
                  className={errors.password ? 'error' : ''}
                  required
                />
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>
              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>
              {errors.general && <div className="general-error">{errors.general}</div>}
              {loginSuccess && <div className="success-message">Login successful! Redirecting...</div>}
              <button
                type="submit"
                className={`login-button ${loginSuccess ? 'success' : ''}`}
                disabled={isSubmitting || loginSuccess}
              >
                {isSubmitting ? 'Logging in...' : loginSuccess ? 'Success!' : 'Login'}
              </button>
            </form>
          </div>
          <div className="realtime-clock">
            <div className="time">{formatTime(currentTime)}</div>
          </div>
        </div>
        <div className='login-caption'>
          <div className="welcome-content">
            <h1>Welcome Back!</h1>
            <p>Sign in to access your account and continue your journey with us.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

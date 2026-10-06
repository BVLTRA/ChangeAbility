import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
// import Logo from '../assets/logo.png';
// import { WovenLightHero } from '../components/ui/woven-light-hero';
import AlertModal from '../components/ui/AlertModal';

export default function Auth() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const [modal, setModal] = useState({ isOpen: false, message: '' });
  const showAlert = (msg) => setModal({ isOpen: true, message: msg });
  
  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Verification State
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) {
      // --- SIGNUP PROCESS ---
      try {
        // Send data to backend port
        const response = await fetch('http://localhost/plethora_api/signup.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            username: username, 
            email: email, 
            password: password 
          })
        });

        // Extract response from backend
        const data = await response.json();


        // Check HTTP status code
        if (response.ok) {
          // Success! Clear form and switch UI toLogin screen
          showAlert("Account created. You may now log in.");
          setUsername('');
          setEmail('');
          setPassword('');
          setIsAgeVerified(false);
          setIsTermsAccepted(false);
          setIsLogin(true); 
        } else {
          // Backend rejected request (duplicate email or username)
          showAlert(`Transmission failed: ${data.error}`);
        }

      } catch (error) {
        console.error("Network error:", error);
        showAlert("Could not connect to the backend server.");
      }

    } else {
      // --- LOGIN MECHANISM ---
      try {
        // Send data to backend port
        const response = await fetch('http://localhost/plethora_api/login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: email, 
            password: password 
          })
        });

        // Extract response from backend
        const data = await response.json();

        
        console.log("[Auth] Envelope received from backend:", data);

        // Process backend response
        if (response.ok) {

          showAlert(`Welcome back, ${data.user.username}`);
          
          login(data.user);
          navigate('/discover'); 
          
        } else {
          // Backend rejected login (wrong password or email)
          showAlert(`Authentication failed: ${data.error}`);
        }

      } catch (error) {
        console.error("Network error:", error);
        showAlert("Could not connect to the backend server.");
      }
    }
  };

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Send Google token to backend
        const response = await fetch('http://localhost/plethora_api/google.php?action=auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: tokenResponse.access_token })
        });

        const data = await response.json();

        if (response.ok) {
          if (data.isNewUser) {
            // Intercept and route to completion, carrying the Google data in memory
            navigate('/complete-account', { state: { googleData: data.googleData } });

          } else {
            // Normal login
            login(data.user); 
            console.log("[Auth] Google Auth successful! User data:", data.user);
            showAlert(`Welcome back, ${data.user.username}`);
            navigate('/discover');
          }
        }
      } catch (error) {
        console.error("Network error:", error);
        showAlert("Could not connect to the backend server.");
      }
    },
    onError: () => {
      console.error('Google Login Failed');
    }
  });

  // The button is disabled if it's a Signup AND they haven't checked both boxes
  const isSubmitDisabled = !isLogin && (!isAgeVerified || !isTermsAccepted);

  return (
    <main className="auth-layout">
      <div className="hero-canvas-wrapper">
        <WovenLightHero />
      </div>
      <header className="auth-global-header">
        <Link to="/" className="brand-logo">
          <img src={Logo} alt="Plethora Logo" className="brand-image" />
        </Link>
      </header>

      <div className="auth-left">
        <div className="welcome-text-wrapper" key={isLogin ? 'login' : 'signup'}>
          <h1 className="welcome-title">
            {isLogin ? "Welcome back to the community." : "Welcome to the community."}
          </h1>
          <p className="welcome-subtitle">
            {isLogin ? "Pick up where you left off. The grid is listening." : "Offload the weight. Connect with others."}
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          
          <header className="auth-header">
            <button 
              className={`auth-toggle ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Log In
            </button>
            <button 
              className={`auth-toggle ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
            {/* The sliding indicator */}
            <div className={`auth-indicator ${isLogin ? 'login-active' : 'signup-active'}`}></div>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            
            {/* Animated Username Field */}
            <div className={`expandable-field ${!isLogin ? 'visible' : ''}`}>
              <div className="expandable-inner">
                <div className="input-group no-margin">
                  <label htmlFor="username">Username</label>
                  <input 
                    type="text" 
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="unfiltered_node"
                    required={!isLogin} 
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="node@network.com"
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Animated Agreements */}
            <div className={`expandable-field ${!isLogin ? 'visible' : ''}`}>
              <div className="expandable-inner">
                <div className="auth-agreements">
                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="age-verify" 
                      checked={isAgeVerified}
                      onChange={(e) => setIsAgeVerified(e.target.checked)}
                    />
                    <label htmlFor="age-verify">I confirm that I am 13 years of age or older.</label>
                  </div>
                  
                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="terms-verify" 
                      checked={isTermsAccepted}
                      onChange={(e) => setIsTermsAccepted(e.target.checked)}
                    />
                    <label htmlFor="terms-verify">
                      I agree to the <Link to="/terms" target="_blank" rel="noopener noreferrer" className="terms-link">Terms of Use</Link>.
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitDisabled}>
              {isLogin ? 'Initialize Session' : 'Create Node'}
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="oauth-group">
            <button className="btn-oauth" type="button" onClick={() => handleGoogleAuth()}>
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>

        </div>

        <div className="guest-link-wrapper">
          <button onClick={() => navigate('/discover')} className="guest-link">
            Continue as guest
          </button>
        </div>

      </div>

      <AlertModal 
  isOpen={modal.isOpen} 
  message={modal.message} 
  onClose={() => setModal({ ...modal, isOpen: false })} 
/>

    </main>
  );
}
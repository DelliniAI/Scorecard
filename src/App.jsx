import React, { useState } from 'react';
import ScorecardQuiz from './components/ScorecardQuiz';
import './App.css';

function App() {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <div className="app">
      {!showQuiz ? (
        <div className="container">
          <div className="landing-card">
            <div className="logo-section">
              <div className="logo">Dellini AI</div>
            </div>
            
            <h1>AI Operations Readiness Scorecard</h1>
            <p className="subtitle">Discover your manufacturing company's AI readiness in 8 minutes</p>
            
            <div className="benefits">
              <div className="benefit-item">
                <span className="icon">✓</span>
                <span>Assess your operational visibility</span>
              </div>
              <div className="benefit-item">
                <span className="icon">✓</span>
                <span>Identify AI implementation gaps</span>
              </div>
              <div className="benefit-item">
                <span className="icon">✓</span>
                <span>Get personalized recommendations</span>
              </div>
            </div>

            <button className="btn-start" onClick={() => setShowQuiz(true)}>
              Start Assessment
            </button>

            <p className="disclaimer">
              No credit card required. Results sent to your email.
            </p>
          </div>
        </div>
      ) : (
        <ScorecardQuiz onBack={() => setShowQuiz(false)} />
      )}
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import './ScorecardQuiz.css';

const QUESTIONS = [
  {
    id: 1,
    category: 'Data Infrastructure',
    question: 'How centralized is your operational data?',
    options: [
      { text: 'Scattered across multiple systems', score: 1 },
      { text: 'Partially integrated', score: 2 },
      { text: 'Mostly centralized', score: 3 },
      { text: 'Fully centralized and accessible', score: 4 }
    ]
  },
  {
    id: 2,
    category: 'Data Infrastructure',
    question: 'What percentage of your production data is captured in real-time?',
    options: [
      { text: 'Less than 25%', score: 1 },
      { text: '25-50%', score: 2 },
      { text: '50-75%', score: 3 },
      { text: 'More than 75%', score: 4 }
    ]
  },
  {
    id: 3,
    category: 'Process Documentation',
    question: 'How well are your manufacturing processes documented?',
    options: [
      { text: 'Minimal or no documentation', score: 1 },
      { text: 'Basic documentation exists', score: 2 },
      { text: 'Well documented with some gaps', score: 3 },
      { text: 'Comprehensive and current documentation', score: 4 }
    ]
  },
  {
    id: 4,
    category: 'Process Documentation',
    question: 'Do you have standard operating procedures (SOPs) for key processes?',
    options: [
      { text: 'No formal SOPs', score: 1 },
      { text: 'SOPs for some processes', score: 2 },
      { text: 'SOPs for most processes', score: 3 },
      { text: 'Comprehensive SOPs for all key processes', score: 4 }
    ]
  },
  {
    id: 5,
    category: 'Operational Visibility',
    question: 'How quickly can you identify production bottlenecks?',
    options: [
      { text: 'Days or weeks', score: 1 },
      { text: 'Hours', score: 2 },
      { text: 'Minutes', score: 3 },
      { text: 'Real-time visibility', score: 4 }
    ]
  },
  {
    id: 6,
    category: 'Operational Visibility',
    question: 'What visibility do you have into equipment downtime causes?',
    options: [
      { text: 'Limited or reactive', score: 1 },
      { text: 'Basic tracking', score: 2 },
      { text: 'Good tracking with some predictive elements', score: 3 },
      { text: 'Full predictive and preventive visibility', score: 4 }
    ]
  },
  {
    id: 7,
    category: 'Team Alignment',
    question: 'How aligned is your team on operational metrics and KPIs?',
    options: [
      { text: 'Minimal alignment', score: 1 },
      { text: 'Some alignment across departments', score: 2 },
      { text: 'Good alignment with minor gaps', score: 3 },
      { text: 'Full alignment across all levels', score: 4 }
    ]
  },
  {
    id: 8,
    category: 'Team Alignment',
    question: 'How ready is your team for AI/automation implementation?',
    options: [
      { text: 'Not ready, significant training needed', score: 1 },
      { text: 'Somewhat ready, training required', score: 2 },
      { text: 'Mostly ready with some upskilling needed', score: 3 },
      { text: 'Well-trained and ready for implementation', score: 4 }
    ]
  },
  {
    id: 9,
    category: 'Data Infrastructure',
    question: 'Do you have a data governance policy in place?',
    options: [
      { text: 'No formal policy', score: 1 },
      { text: 'Basic policy exists', score: 2 },
      { text: 'Formal policy with some gaps', score: 3 },
      { text: 'Comprehensive data governance', score: 4 }
    ]
  },
  {
    id: 10,
    category: 'Process Documentation',
    question: 'How frequently are your processes reviewed and updated?',
    options: [
      { text: 'Rarely or never', score: 1 },
      { text: 'Annually', score: 2 },
      { text: 'Quarterly', score: 3 },
      { text: 'Monthly or continuously', score: 4 }
    ]
  },
  {
    id: 11,
    category: 'Operational Visibility',
    question: 'Do you have dashboards for real-time operational monitoring?',
    options: [
      { text: 'No dashboards', score: 1 },
      { text: 'Basic dashboards for limited metrics', score: 2 },
      { text: 'Good dashboards for most areas', score: 3 },
      { text: 'Comprehensive real-time dashboards', score: 4 }
    ]
  },
  {
    id: 12,
    category: 'Team Alignment',
    question: 'How often does leadership review operational performance data?',
    options: [
      { text: 'Rarely', score: 1 },
      { text: 'Monthly', score: 2 },
      { text: 'Weekly', score: 3 },
      { text: 'Daily or continuously', score: 4 }
    ]
  }
];

function ScorecardQuiz({ onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({});
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (score) => {
    const newScores = { ...scores, [currentQuestion]: score };
    setScores(newScores);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowEmailForm(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
      const maxScore = QUESTIONS.length * 4;
      const percentage = Math.round((totalScore / maxScore) * 100);

      const response = await fetch('/api/submit-scorecard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          score: totalScore,
          percentage,
          maxScore,
          answers: scores
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Error submitting scorecard. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting scorecard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  if (submitted) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="success-icon">✓</div>
          <h2>Assessment Complete!</h2>
          <p>Your personalized AI Readiness Report has been sent to <strong>{email}</strong></p>
          <p className="success-message">Check your inbox for your detailed scorecard and recommendations.</p>
          <button className="btn-back" onClick={onBack}>Back to Home</button>
        </div>
      </div>
    );
  }

  if (showEmailForm) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>Get Your Results</h2>
          <p>Enter your email to receive your personalized AI Readiness Report</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Sending...' : 'Get My Report'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <button className="btn-back" onClick={onBack}>← Back</button>
          <div className="progress-info">
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="category-badge">{QUESTIONS[currentQuestion].category}</div>

        <h2>{QUESTIONS[currentQuestion].question}</h2>

        <div className="options">
          {QUESTIONS[currentQuestion].options.map((option, idx) => (
            <button
              key={idx}
              className="option-btn"
              onClick={() => handleAnswer(option.score)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScorecardQuiz;

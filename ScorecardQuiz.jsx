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

function getRecommendations(percentage) {
  if (percentage >= 85) {
    return {
      level: 'Advanced',
      description: 'Your organization is well-prepared for AI implementation. Focus on optimization and advanced use cases.',
      actions: [
        'Implement advanced predictive analytics',
        'Explore AI-driven process automation',
        'Develop AI governance framework',
        'Plan for continuous improvement'
      ]
    };
  } else if (percentage >= 65) {
    return {
      level: 'Intermediate',
      description: 'You have a solid foundation. Address key gaps before full AI implementation.',
      actions: [
        'Strengthen data infrastructure',
        'Enhance process documentation',
        'Improve real-time visibility',
        'Upskill team on AI concepts'
      ]
    };
  } else if (percentage >= 45) {
    return {
      level: 'Developing',
      description: 'You have foundational elements but need significant preparation for AI adoption.',
      actions: [
        'Centralize operational data',
        'Document core processes',
        'Establish KPI framework',
        'Build team alignment'
      ]
    };
  } else {
    return {
      level: 'Early Stage',
      description: 'Start with foundational improvements before considering AI implementation.',
      actions: [
        'Create data governance policy',
        'Document all key processes',
        'Establish baseline metrics',
        'Build cross-functional team'
      ]
    };
  }
}

function ScorecardQuiz({ onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({});
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

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
    setError('');

    try {
      const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
      const maxScore = QUESTIONS.length * 4;
      const percentage = Math.round((totalScore / maxScore) * 100);
      const recommendations = getRecommendations(percentage);

      // Store results for display
      setResults({
        email,
        percentage,
        level: recommendations.level,
        description: recommendations.description,
        actions: recommendations.actions
      });

      // Prepare the email message for the user
      const actionsList = recommendations.actions.map((action, i) => `${i + 1}. ${action}`).join('\n');
      const userEmailMessage = `Your AI Readiness Score: ${percentage}%\n\nReadiness Level: ${recommendations.level}\n\n${recommendations.description}\n\nRecommended Next Steps:\n${actionsList}\n\nReady to transform your manufacturing operations? Book a discovery call to get your personalized AI roadmap.\n\nhttps://calendly.com/zohour-hassan/dellini-discovery-call`;

      // Submit to Formspree (sends to your inbox)
      const adminFormData = new FormData();
      adminFormData.append('email', email);
      adminFormData.append('percentage', percentage);
      adminFormData.append('level', recommendations.level);
      adminFormData.append('description', recommendations.description);
      adminFormData.append('actions', recommendations.actions.join(', '));

      // Send to admin
      const response = await fetch('https://formspree.io/f/maqaalvn', {
        method: 'POST',
        body: adminFormData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      // Show results anyway - form submission is secondary
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  if (submitted && results) {
    return (
      <div className="quiz-container">
        <div className="results-wrapper">
          {/* Results Section */}
          <div className="results-card">
            <div className="results-header">
              <h2>Your AI Readiness Score</h2>
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-number">{results.percentage}%</span>
                  <span className="score-label">Readiness</span>
                </div>
              </div>
            </div>

            <div className="results-content">
              <div className="level-badge" data-level={results.level.toLowerCase()}>
                {results.level}
              </div>
              <p className="description">{results.description}</p>

              <div className="actions-section">
                <h3>Recommended Next Steps:</h3>
                <ul className="actions-list">
                  {results.actions.map((action, idx) => (
                    <li key={idx}>{action}</li>
                  ))}
                </ul>
              </div>

              <p className="email-confirmation">
                ✓ Results sent to <strong>{results.email}</strong>
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <div className="cta-content">
              <h3>Ready to Transform Your Manufacturing Operations?</h3>
              <p>
                At Dellini, we specialize in helping manufacturing companies like yours leverage AI and data to optimize operations, reduce costs, and improve efficiency.
              </p>
              
              <div className="benefits">
                <h4>What You'll Get from a Discovery Call:</h4>
                <ul>
                  <li>Personalized AI Roadmap tailored to your operations</li>
                  <li>Specific recommendations based on your readiness assessment</li>
                  <li>ROI analysis for potential AI implementations</li>
                  <li>Timeline and resource requirements</li>
                </ul>
              </div>

              <a 
                href="https://calendly.com/zohour-hassan/dellini-discovery-call" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cta-button"
              >
                Book Your Discovery Call
              </a>

              <p className="cta-subtext">
                30-minute call • No obligation • Expert consultation
              </p>
            </div>
          </div>

          <button className="btn-back" onClick={onBack}>← Back to Home</button>
        </div>
      </div>
    );
  }

  if (showEmailForm) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>Get Your Results</h2>
          <p>Enter your email to see your personalized AI Readiness Report</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Processing...' : 'See My Results'}
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

import express from 'express';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// API endpoint for scorecard submission
app.post('/api/submit-scorecard', async (req, res) => {
  try {
    const { email, score, percentage, maxScore, answers } = req.body;

    // Determine readiness level
    let readinessLevel = 'Foundational';
    let recommendations = [];

    if (percentage >= 75) {
      readinessLevel = 'Advanced';
      recommendations = [
        'Your organization has strong operational foundations for AI implementation',
        'Focus on scaling AI solutions across more processes',
        'Consider advanced predictive analytics and optimization'
      ];
    } else if (percentage >= 50) {
      readinessLevel = 'Intermediate';
      recommendations = [
        'You have good operational visibility but need to strengthen data infrastructure',
        'Implement comprehensive data governance policies',
        'Increase team training and alignment on AI initiatives'
      ];
    } else {
      readinessLevel = 'Foundational';
      recommendations = [
        'Prioritize centralizing your operational data',
        'Develop comprehensive process documentation and SOPs',
        'Establish real-time monitoring dashboards',
        'Build team alignment on operational metrics'
      ];
    }

    // Send email to user
    const userEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #3B3FA0 0%, #FF6B35 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .score-box { background: #F8FAFC; padding: 30px; text-align: center; }
          .score-number { font-size: 48px; font-weight: bold; color: #3B3FA0; }
          .score-label { font-size: 14px; color: #64748B; margin-top: 10px; }
          .readiness { font-size: 24px; font-weight: bold; color: #FF6B35; margin-top: 20px; }
          .recommendations { padding: 30px; background: white; }
          .rec-item { margin: 15px 0; padding: 15px; background: #F0F4FF; border-left: 4px solid #3B3FA0; }
          .cta { text-align: center; margin: 30px 0; }
          .cta-button { background: linear-gradient(135deg, #3B3FA0 0%, #FF6B35 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; }
          .footer { text-align: center; padding: 20px; color: #94A3B8; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your AI Readiness Assessment Results</h1>
          </div>
          
          <div class="score-box">
            <div class="score-number">${percentage}%</div>
            <div class="score-label">Your AI Readiness Score</div>
            <div class="readiness">${readinessLevel}</div>
          </div>

          <div class="recommendations">
            <h2>Your Recommendations:</h2>
            ${recommendations.map(rec => `<div class="rec-item">${rec}</div>`).join('')}
            
            <div class="cta">
              <p>Ready to take the next step? Let's discuss your AI operations roadmap.</p>
              <a href="https://dellini.ai" class="cta-button">Schedule a Consultation</a>
            </div>
          </div>

          <div class="footer">
            <p>Dellini AI | Operational Consulting for Manufacturing</p>
            <p>© 2026 Dellini AI. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your AI Readiness Scorecard - ${percentage}% Complete`,
      html: userEmailContent
    });

    // Send notification to admin
    const adminEmailContent = `
      <h2>New Scorecard Submission</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Score:</strong> ${score}/${maxScore} (${percentage}%)</p>
      <p><strong>Readiness Level:</strong> ${readinessLevel}</p>
      <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Scorecard Submission - ${email}`,
      html: adminEmailContent
    });

    res.json({ success: true, message: 'Scorecard submitted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to submit scorecard' });
  }
});

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

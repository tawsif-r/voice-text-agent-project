import { useEffect, useState } from 'react'
import './App.css'

type Theme = 'dark' | 'light'

const features = [
  {
    icon: '🎙️',
    title: 'Natural Voice Conversations',
    description:
      'Speak naturally. VoiceNest listens to your questions and turns your words into meaningful conversations.',
    className: 'feature-large',
  },
  {
    icon: '🧠',
    title: 'Intelligent AI Responses',
    description:
      'Get contextual answers that help you understand ideas and explore topics further.',
    className: '',
  },
  {
    icon: '🔊',
    title: 'AI Voice Responses',
    description:
      'Listen to AI-generated answers instead of reading every response.',
    className: '',
  },
  {
    icon: '✨',
    title: 'Smart Follow-ups',
    description:
      'Discover relevant questions and useful next steps based on your conversation.',
    className: '',
  },
  {
    icon: '💡',
    title: 'Personalized Context',
    description:
      'Build toward more relevant conversations using useful context from previous interactions.',
    className: 'feature-wide',
  },
]

const faqs = [
  {
    question: 'What is VoiceNest?',
    answer:
      'VoiceNest is an AI-powered voice assistant designed to help you interact with AI through natural spoken conversations.',
  },
  {
    question: 'Do I need to type my questions?',
    answer:
      'The main experience is voice-first. You will be able to speak your questions instead of typing them.',
  },
  {
    question: 'Can VoiceNest speak its answers?',
    answer:
      'Yes. VoiceNest is being designed to provide AI-generated spoken responses as well as text responses.',
  },
  {
    question: 'Will VoiceNest remember previous conversations?',
    answer:
      'Personal context and memory are part of the planned experience. Users should have control over what information is retained.',
  },
]

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('voicenest-theme')
    return savedTheme === 'light' ? 'light' : 'dark'
  })

  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('voicenest-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) =>
      current === 'dark' ? 'light' : 'dark',
    )
  }

  return (
    <div className="app-shell">

      {/* Background particles */}
      <div className="particles-layer" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span className="particle" key={index} />
        ))}
      </div>

      {/* Navigation */}
      <header className="landing-header">
        <a href="#home" className="brand">
          <div className="brand-mark">
            <span>V</span>
          </div>

          <span className="brand-name">
            Voice<span>Nest</span>
          </span>
        </a>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#demo">Preview</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <a href="#demo" className="nav-cta">
            Explore VoiceNest ↗
          </a>
        </div>
      </header>

      <main>

        {/* Hero */}
        <section className="landing-hero" id="home">

          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              A NEW WAY TO INTERACT WITH AI
            </div>

            <h1>
              Think naturally.
              <br />
              <span>Speak intelligently.</span>
            </h1>

            <p className="hero-description">
              Meet your personal AI voice companion.
              Ask questions, explore ideas, and discover
              more through natural conversations.
            </p>

            <div className="hero-actions">
              <a href="#demo" className="primary-cta">
                Explore the experience
                <span>↗</span>
              </a>

              <a href="#how-it-works" className="secondary-cta">
                How it works
                <span>↓</span>
              </a>
            </div>

            <div className="hero-note">
              <span className="status-dot" />
              Voice-first AI experience
            </div>
          </div>

          {/* Hero visual */}
          <div className="hero-visual">

            <div className="visual-glow" />

            <div className="preview-window">

              <div className="preview-topbar">
                <div className="preview-dots">
                  <span />
                  <span />
                  <span />
                </div>

                <span>VoiceNest Assistant</span>

                <span className="preview-live">
                  ● LIVE PREVIEW
                </span>
              </div>

              <div className="preview-body">

                <div className="preview-greeting">
                  <span className="preview-avatar">V</span>

                  <div>
                    <strong>Your AI companion</strong>
                    <p>Ready for a conversation</p>
                  </div>
                </div>

                <div className="preview-orb">
                  <div className="orb-ring ring-one" />
                  <div className="orb-ring ring-two" />
                  <div className="orb-core">🎙️</div>
                </div>

                <p className="preview-status">
                  Your voice, your ideas.
                </p>

                <div className="waveform" aria-label="Decorative audio waveform">
                  {Array.from({ length: 35 }, (_, index) => (
                    <span
                      key={index}
                      style={{
                        height: `${12 + Math.abs(Math.sin(index * 0.65)) * 38}px`,
                      }}
                    />
                  ))}
                </div>

                <div className="preview-bottom">
                  <span>Natural conversation starts here</span>
                  <span>✦ AI powered</span>
                </div>

              </div>
            </div>

            <div className="floating-card floating-card-top">
              <span>✨</span>
              <div>
                <strong>Smart responses</strong>
                <small>Context-aware AI</small>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <span>🔊</span>
              <div>
                <strong>Voice enabled</strong>
                <small>Listen and interact</small>
              </div>
            </div>

          </div>
        </section>

        {/* Intro / positioning */}
        <section className="trust-strip">
          <p>DESIGNED FOR MORE NATURAL AI INTERACTIONS</p>
          <div className="trust-items">
            <span>VOICE FIRST</span>
            <span>✦</span>
            <span>CONTEXT AWARE</span>
            <span>✦</span>
            <span>BUILT TO EXPLORE</span>
          </div>
        </section>

        {/* Problem and solution */}
        <section className="problem-section section-container">

          <div className="section-heading">
            <span className="eyebrow">WHY VOICENEST</span>

            <h2>
              AI conversations should feel
              <br />
              <span>more natural.</span>
            </h2>

            <p>
              Ideas flow naturally when you speak.
              Your AI experience should keep up.
            </p>
          </div>

          <div className="problem-grid">

            <div className="problem-card">
              <span className="card-icon">⌨️</span>
              <h3>Traditional interaction</h3>
              <p>
                Typing every question can interrupt your
                thought process and slow down exploration.
              </p>
              <span className="card-caption">THE CHALLENGE</span>
            </div>

            <div className="solution-card">
              <span className="card-icon">✦</span>
              <h3>A more natural experience</h3>
              <p>
                Speak your thoughts, receive intelligent
                responses, and keep exploring without
                breaking your flow.
              </p>
              <span className="card-caption">THE VOICENEST APPROACH</span>
            </div>

          </div>
        </section>

        {/* Features */}
        <section className="features-section section-container" id="features">

          <div className="section-heading">
            <span className="eyebrow">WHAT MAKES IT DIFFERENT</span>

            <h2>
              More than just
              <br />
              <span>voice to text.</span>
            </h2>

            <p>
              An intelligent conversation experience
              designed around the way people think.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article
                className={`feature-card ${feature.className}`}
                key={feature.title}
              >
                <span className="feature-icon">
                  {feature.icon}
                </span>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

                <span className="feature-arrow">↗</span>
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          className="how-section section-container"
          id="how-it-works"
        >
          <div className="section-heading">
            <span className="eyebrow">SIMPLE BY DESIGN</span>

            <h2>
              Three steps.
              <br />
              <span>One conversation.</span>
            </h2>
          </div>

          <div className="steps-grid">

            <article className="step-card">
              <span className="step-number">01</span>
              <span className="step-icon">🎙️</span>
              <h3>Speak naturally</h3>
              <p>
                Start speaking and share whatever
                is on your mind.
              </p>
            </article>

            <article className="step-card">
              <span className="step-number">02</span>
              <span className="step-icon">🧠</span>
              <h3>AI understands</h3>
              <p>
                Your speech is processed and
                transformed into an AI conversation.
              </p>
            </article>

            <article className="step-card">
              <span className="step-number">03</span>
              <span className="step-icon">🔊</span>
              <h3>Listen and explore</h3>
              <p>
                Get a response and discover
                relevant questions to explore next.
              </p>
            </article>

          </div>
        </section>

        {/* Product demo */}
        <section className="demo-section section-container" id="demo">

          <div className="demo-heading">
            <span className="eyebrow">THE EXPERIENCE</span>

            <h2>
              Meet your new
              <br />
              <span>conversation space.</span>
            </h2>

            <p>
              A focused space for speaking, understanding,
              and exploring ideas.
            </p>
          </div>

          <div className="demo-window">

            <div className="demo-window-header">
              <div className="brand">
                <div className="brand-mark">
                  <span>V</span>
                </div>

                <span className="brand-name">
                  Voice<span>Nest</span>
                </span>
              </div>

              <span className="demo-badge">
                UI PREVIEW
              </span>
            </div>

            <div className="demo-content">

              <div className="demo-mic">
                <div className="demo-mic-ring" />
                <span>🎙️</span>
              </div>

              <h3>Your next idea starts with a question.</h3>

              <p>
                Voice interaction and AI responses will
                be available here.
              </p>

              <button
                type="button"
                className="primary-cta demo-button"
                disabled
              >
                Voice interaction coming soon
              </button>

            </div>

            <div className="demo-panels">

              <div>
                <span>🎤 TRANSCRIPT</span>
                <p>Your spoken words will appear here.</p>
              </div>

              <div>
                <span>✨ AI RESPONSE</span>
                <p>Your intelligent response will appear here.</p>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-section section-container" id="faq">

          <div className="section-heading">
            <span className="eyebrow">GOT QUESTIONS?</span>

            <h2>
              Frequently asked
              <br />
              <span>questions.</span>
            </h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <article className="faq-item" key={faq.question}>

                <button
                  type="button"
                  className="faq-question"
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  <span>{openFaq === index ? '−' : '+'}</span>
                </button>

                {openFaq === index && (
                  <p className="faq-answer">
                    {faq.answer}
                  </p>
                )}

              </article>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta section-container">

          <div className="final-cta-content">
            <span className="eyebrow">YOUR VOICE HAS A PLACE HERE</span>

            <h2>
              Ready to think
              <br />
              <span>out loud?</span>
            </h2>

            <p>
              Explore a more natural way to interact
              with artificial intelligence.
            </p>

            <a href="#demo" className="primary-cta">
              Explore VoiceNest ↗
            </a>
          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="landing-footer">

        <a href="#home" className="brand">
          <div className="brand-mark">
            <span>V</span>
          </div>

          <span className="brand-name">
            Voice<span>Nest</span>
          </span>
        </a>

        <p>
          A more natural way to interact with AI.
        </p>

        <span className="footer-copy">
          © 2026 VoiceNest. Built with curiosity.
        </span>

      </footer>

    </div>
  )
}

export default App
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: 0 }}>
      
      {/* NAVBAR */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        transition: 'all 0.3s',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          ResumeGenie Pro
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/login" style={{
            color: scrolled ? '#333' : 'white',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Login
          </Link>
          <Link href="/signup" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '10px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white',
        padding: '80px 20px 40px'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '8px 20px',
          borderRadius: '50px',
          marginBottom: '20px',
          fontSize: '14px',
          backdropFilter: 'blur(10px)'
        }}>
          🚀 AI Powered Resume Builder
        </div>
        
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 'bold',
          marginBottom: '20px',
          lineHeight: '1.2',
          maxWidth: '900px'
        }}>
          Build Your Perfect Resume<br/>
          <span style={{ color: '#ffd700' }}>In 30 Seconds</span>
        </h1>
        
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.3rem)',
          maxWidth: '700px',
          marginBottom: '40px',
          opacity: 0.95,
          lineHeight: '1.6'
        }}>
          AI writes your resume. ATS scanner checks it. 
          Beautiful templates make it stand out.
          Land your dream job faster than ever.
        </p>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/signup" style={{
            background: 'white',
            color: '#667eea',
            padding: '16px 40px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '18px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}>
            🚀 Create Resume Free
          </Link>
          <Link href="#features" style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '16px 40px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '18px',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            See Features
          </Link>
        </div>

        <div style={{
          marginTop: '40px',
          display: 'flex',
          gap: '30px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          fontSize: '14px',
          opacity: 0.9
        }}>
          <span>✓ No Credit Card Required</span>
          <span>✓ Free PDF Download</span>
          <span>✓ ATS Optimized</span>
          <span>✓ Works Globally</span>
        </div>
      </section>

      {/* STATS SECTION */}
      <section style={{
        background: '#1a1a2e',
        padding: '60px 20px',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          textAlign: 'center'
        }}>
          {[
            { number: '50,000+', label: 'Resumes Created' },
            { number: '95%', label: 'ATS Pass Rate' },
            { number: '30 Sec', label: 'Average Build Time' },
            { number: '150+', label: 'Countries' }
          ].map((stat, i) => (
            <div key={i}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '10px'
              }}>
                {stat.number}
              </div>
              <div style={{ opacity: 0.8 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" style={{
        padding: '80px 20px',
        background: '#f8f9fa'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#1a1a2e',
              marginBottom: '15px'
            }}>
              Everything You Need to Get Hired
            </h2>
            <p style={{ color: '#666', fontSize: '1.2rem' }}>
              The most complete AI resume builder in the world
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {[
              { icon: '🤖', title: 'AI Resume Writer', desc: 'Enter your job title and let AI write your entire resume with professional content.' },
              { icon: '🎯', title: 'ATS Score Checker', desc: 'Scan your resume and know exactly what to improve for ATS compatibility.' },
              { icon: '⚡', title: '30-Second Build', desc: 'Our intelligent builder helps you complete your resume in under 30 seconds.' },
              { icon: '🎨', title: '100+ Templates', desc: 'Professional templates for every industry. All ATS-friendly and recruiter-approved.' },
              { icon: '🌍', title: 'Global Formats', desc: 'US, UK, EU, India, Government - we support every country format.' },
              { icon: '📊', title: 'Resume Score', desc: 'Get your resume scored out of 100. Compare with successful candidates.' },
              { icon: '🔗', title: 'Shareable Link', desc: 'Share your resume with a beautiful web link. Perfect for LinkedIn.' },
              { icon: '📝', title: 'Cover Letter AI', desc: 'AI generates personalized cover letters for every job you apply to.' },
              { icon: '💼', title: 'Job Matching', desc: 'Paste a job description and AI tailors your resume specifically for that role.' }
            ].map((feature, i) => (
              <div key={i} style={{
                background: 'white',
                padding: '30px',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{feature.icon}</div>
                <h3 style={{ color: '#1a1a2e', marginBottom: '10px', fontSize: '1.3rem' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{
        padding: '80px 20px',
        background: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#1a1a2e',
              marginBottom: '15px'
            }}>
              How It Works
            </h2>
            <p style={{ color: '#666', fontSize: '1.2rem' }}>
              Get your perfect resume in 3 simple steps
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {[
              { step: '1', title: 'Sign Up Free', desc: 'Create your account in 10 seconds. No credit card needed.' },
              { step: '2', title: 'AI Builds Resume', desc: 'Tell us your job. AI writes your entire resume professionally.' },
              { step: '3', title: 'Download & Apply', desc: 'Download as PDF. Share link. Land your dream job.' }
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '0 auto 20px',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}>
                  {item.step}
                </div>
                <h3 style={{ color: '#1a1a2e', marginBottom: '10px', fontSize: '1.5rem' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{
        padding: '80px 20px',
        background: '#f8f9fa'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#1a1a2e',
              marginBottom: '15px'
            }}>
              Simple Pricing
            </h2>
            <p style={{ color: '#666', fontSize: '1.2rem' }}>
              Start free. Upgrade when ready.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {/* FREE PLAN */}
            <div style={{
              background: 'white',
              padding: '40px 30px',
              borderRadius: '20px',
              border: '2px solid #e0e0e0'
            }}>
              <h3 style={{ color: '#1a1a2e', marginBottom: '10px' }}>Free</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '20px' }}>
                ₹0
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                {['3 Resumes', '5 Templates', 'PDF Download', 'Basic ATS Check', 'Shareable Link'].map(f => (
                  <li key={f} style={{ padding: '8px 0', color: '#666' }}>✓ {f}</li>
                ))}
              </ul>
              <Link href="/signup" style={{
                display: 'block',
                padding: '14px',
                background: '#f0f0f0',
                color: '#333',
                textAlign: 'center',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                Start Free
              </Link>
            </div>

            {/* PRO PLAN */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '40px 30px',
              borderRadius: '20px',
              color: 'white',
              transform: 'scale(1.05)',
              boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '20px',
                background: '#ffd700',
                color: '#1a1a2e',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                MOST POPULAR
              </div>
              <h3 style={{ marginBottom: '10px' }}>Pro</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>
                ₹299<span style={{ fontSize: '1rem' }}>/mo</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                {['Unlimited Resumes', '100+ Templates', 'AI Resume Writer', 'ATS Scanner', 'Cover Letter AI', 'Job Matching', 'Priority Support'].map(f => (
                  <li key={f} style={{ padding: '8px 0' }}>✓ {f}</li>
                ))}
              </ul>
              <Link href="/signup" style={{
                display: 'block',
                padding: '14px',
                background: 'white',
                color: '#667eea',
                textAlign: 'center',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '700'
              }}>
                Start Pro Trial
              </Link>
            </div>

            {/* ENTERPRISE */}
            <div style={{
              background: 'white',
              padding: '40px 30px',
              borderRadius: '20px',
              border: '2px solid #e0e0e0'
            }}>
              <h3 style={{ color: '#1a1a2e', marginBottom: '10px' }}>Enterprise</h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '20px' }}>
                ₹999<span style={{ fontSize: '1rem' }}>/mo</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                {['Everything in Pro', 'Team Management', 'Custom Branding', 'API Access', 'Analytics Dashboard', 'Dedicated Support'].map(f => (
                  <li key={f} style={{ padding: '8px 0', color: '#666' }}>✓ {f}</li>
                ))}
              </ul>
              <Link href="/signup" style={{
                display: 'block',
                padding: '14px',
                background: '#f0f0f0',
                color: '#333',
                textAlign: 'center',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          marginBottom: '20px'
        }}>
          Ready to Get Hired Faster?
        </h2>
        <p style={{
          fontSize: '1.3rem',
          marginBottom: '30px',
          opacity: 0.95
        }}>
          Join 50,000+ professionals who built their dream careers
        </p>
        <Link href="/signup" style={{
          display: 'inline-block',
          background: 'white',
          color: '#667eea',
          padding: '18px 50px',
          borderRadius: '10px',
          textDecoration: 'none',
          fontWeight: '700',
          fontSize: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}>
          🚀 Build My Resume Free
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: '#1a1a2e',
        color: 'white',
        padding: '40px 20px 20px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          ResumeGenie Pro
        </div>
        <p style={{ opacity: 0.7, marginBottom: '20px' }}>
          AI Powered Resume Builder for Global Job Seekers
        </p>
        <p style={{ opacity: 0.5, fontSize: '14px' }}>
          © 2026 ResumeGenie Pro. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

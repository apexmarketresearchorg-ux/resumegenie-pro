'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    setUser(user)

    // Get profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    setProfile(profileData)

    // Get resumes
    const { data: resumeData } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    setResumes(resumeData || [])

    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const deleteResume = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return
    
    await supabase.from('resumes').delete().eq('id', id)
    setResumes(resumes.filter(r => r.id !== id))
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f5f5',
        fontFamily: 'system-ui'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      fontFamily: 'system-ui'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link href="/" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textDecoration: 'none'
        }}>
          ResumeGenie Pro
        </Link>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{
            background: '#f0f0f0',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            color: '#666'
          }}>
            {profile?.plan === 'free' ? '🆓 Free Plan' : '⭐ Pro Plan'}
          </div>
          <span style={{ color: '#666' }}>{user?.email}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
          borderRadius: '20px',
          color: 'white',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>
              Welcome back, {profile?.full_name || 'there'}! 👋
            </h1>
            <p style={{ opacity: 0.95, fontSize: '1.1rem' }}>
              Ready to build your perfect resume?
            </p>
          </div>
          <Link href="/resume/new" style={{
            background: 'white',
            color: '#667eea',
            padding: '16px 32px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            + Create New Resume
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>📄</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e' }}>
              {resumes.length}
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>Total Resumes</div>
          </div>
          
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🤖</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e' }}>
              {profile?.ai_credits || 0}
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>AI Credits Left</div>
          </div>

          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>⭐</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e' }}>
              {profile?.plan === 'free' ? 'Free' : 'Pro'}
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>Current Plan</div>
          </div>

          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🎁</div>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1a1a2e' }}>
              {profile?.referral_code}
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>Your Referral Code</div>
          </div>
        </div>

        {/* My Resumes Section */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1a1a2e', marginBottom: '20px' }}>
            📁 My Resumes
          </h2>

          {resumes.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#f9f9f9',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📝</div>
              <h3 style={{ color: '#333', marginBottom: '10px' }}>
                No resumes yet
              </h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Create your first AI-powered resume in 30 seconds
              </p>
              <Link href="/resume/new" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '14px 30px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                🚀 Create First Resume
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {resumes.map(resume => (
                <div key={resume.id} style={{
                  border: '1px solid #e0e0e0',
                  padding: '20px',
                  borderRadius: '12px',
                  transition: 'all 0.3s'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📄</div>
                  <h3 style={{ color: '#1a1a2e', marginBottom: '5px' }}>
                    {resume.title}
                  </h3>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                    Template: {resume.template_id}
                  </p>
                  <p style={{ color: '#999', fontSize: '12px', marginBottom: '15px' }}>
                    Updated: {new Date(resume.updated_at).toLocaleDateString()}
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link href={`/resume/${resume.id}`} style={{
                      flex: 1,
                      padding: '10px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      textAlign: 'center',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteResume(resume.id)}
                      style={{
                        padding: '10px 15px',
                        background: '#fee',
                        color: '#c00',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

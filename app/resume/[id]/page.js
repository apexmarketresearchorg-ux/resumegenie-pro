'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

export default function EditResumePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('personal')
  const [resumeTitle, setResumeTitle] = useState('My Resume')
  const [showAIModal, setShowAIModal] = useState(false)
  const [showATSModal, setShowATSModal] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [atsLoading, setAtsLoading] = useState(false)
  const [atsResult, setAtsResult] = useState(null)
  const [aiInput, setAiInput] = useState({ jobTitle: '', experience: '', skills: '' })
  const router = useRouter()
  const params = useParams()
  const resumeId = params.id

  const [resume, setResume] = useState({
    personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '', website: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  })

  useEffect(() => {
    checkUserAndLoad()
  }, [resumeId])

  const checkUserAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUser(user)

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      alert('Resume not found')
      router.push('/dashboard')
      return
    }

    setResumeTitle(data.title)
    setResume(data.content || resume)
    setLoading(false)
  }

  const generateWithAI = async () => {
    if (!aiInput.jobTitle.trim()) {
      alert('Please enter a job title')
      return
    }
    setAiLoading(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiInput)
      })
      const result = await response.json()
      if (result.success && result.data) {
        const aiData = result.data
        setResume(prev => ({
          ...prev,
          personal: { ...prev.personal, jobTitle: aiInput.jobTitle },
          summary: aiData.summary || prev.summary,
          experience: (aiData.experience || []).map(e => ({ ...e, id: Date.now() + Math.random() })),
          education: (aiData.education || []).map(e => ({ ...e, id: Date.now() + Math.random() })),
          skills: aiData.skills || prev.skills
        }))
        setShowAIModal(false)
        alert('Resume regenerated! Edit any field to customize.')
      } else {
        alert('AI generation failed: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setAiLoading(false)
    }
  }

  const checkATSScore = async () => {
    setAtsLoading(true)
    setShowATSModal(true)
    try {
      const response = await fetch('/api/ai/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription: '' })
      })
      const result = await response.json()
      if (result.success) setAtsResult(result.data)
      else { alert('ATS check failed'); setShowATSModal(false) }
    } catch (error) {
      alert('Error: ' + error.message)
      setShowATSModal(false)
    } finally {
      setAtsLoading(false)
    }
  }

  const updatePersonal = (field, value) => setResume(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }))
  const addExperience = () => setResume(prev => ({ ...prev, experience: [...prev.experience, { id: Date.now(), company: '', role: '', startDate: '', endDate: '', description: '' }] }))
  const updateExperience = (id, field, value) => setResume(prev => ({ ...prev, experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp) }))
  const removeExperience = (id) => setResume(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }))
  const addEducation = () => setResume(prev => ({ ...prev, education: [...prev.education, { id: Date.now(), institution: '', degree: '', field: '', startDate: '', endDate: '', grade: '' }] }))
  const updateEducation = (id, field, value) => setResume(prev => ({ ...prev, education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu) }))
  const removeEducation = (id) => setResume(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }))
  const addSkill = (skill) => { if (skill && !resume.skills.includes(skill)) setResume(prev => ({ ...prev, skills: [...prev.skills, skill] })) }
  const removeSkill = (skill) => setResume(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
  const addProject = () => setResume(prev => ({ ...prev, projects: [...prev.projects, { id: Date.now(), name: '', description: '', link: '', tech: '' }] }))
  const updateProject = (id, field, value) => setResume(prev => ({ ...prev, projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p) }))
  const removeProject = (id) => setResume(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }))

  const saveResume = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('resumes')
      .update({ title: resumeTitle, content: resume, updated_at: new Date().toISOString() })
      .eq('id', resumeId)
      .eq('user_id', user.id)
    setSaving(false)
    if (error) alert('Error: ' + error.message)
    else alert('Resume updated!')
  }

  const downloadPDF = () => window.print()

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
        <p>Loading your resume...</p>
      </div>
    </div>
  }

  const sections = [
    { id: 'personal', label: '👤 Personal' },
    { id: 'summary', label: '📝 Summary' },
    { id: 'experience', label: '💼 Experience' },
    { id: 'education', label: '🎓 Education' },
    { id: 'skills', label: '⚡ Skills' },
    { id: 'projects', label: '🚀 Projects' }
  ]

  const inputStyle = { width: '100%', padding: '10px 12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box', fontFamily: 'inherit' }
  const labelStyle = { display: 'block', marginBottom: '6px', color: '#333', fontWeight: '500', fontSize: '13px' }

  return (
    <div style={{ fontFamily: 'system-ui', background: '#f5f7fa', minHeight: '100vh' }}>
      <header style={{ background: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap', gap: '10px' }} className="no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/dashboard" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>← Dashboard</Link>
          <input type="text" value={resumeTitle} onChange={(e) => setResumeTitle(e.target.value)} style={{ border: 'none', fontSize: '18px', fontWeight: '600', color: '#1a1a2e', outline: 'none', background: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setShowAIModal(true)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>🤖 AI Generate</button>
          <button onClick={checkATSScore} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>🎯 ATS Score</button>
          <button onClick={downloadPDF} style={{ padding: '10px 20px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>📥 PDF</button>
          <button onClick={saveResume} disabled={saving} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>{saving ? 'Saving...' : '💾 Save'}</button>
        </div>
      </header>

      {showAIModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '30px', maxWidth: '500px', width: '100%' }}>
            <h2 style={{ color: '#1a1a2e', marginBottom: '10px' }}>🤖 AI Resume Generator</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>This will REPLACE current resume content</p>
            <label style={labelStyle}>Job Title *</label>
            <input type="text" value={aiInput.jobTitle} onChange={(e) => setAiInput({ ...aiInput, jobTitle: e.target.value })} placeholder="Software Engineer" style={inputStyle} />
            <label style={labelStyle}>Experience</label>
            <input type="text" value={aiInput.experience} onChange={(e) => setAiInput({ ...aiInput, experience: e.target.value })} placeholder="3 years" style={inputStyle} />
            <label style={labelStyle}>Skills</label>
            <input type="text" value={aiInput.skills} onChange={(e) => setAiInput({ ...aiInput, skills: e.target.value })} placeholder="React, Python" style={inputStyle} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowAIModal(false)} style={{ flex: 1, padding: '12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
              <button onClick={generateWithAI} disabled={aiLoading} style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>{aiLoading ? '✨ Generating...' : '✨ Generate'}</button>
            </div>
          </div>
        </div>
      )}

      {showATSModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '30px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#1a1a2e' }}>🎯 ATS Score Analysis</h2>
              <button onClick={() => setShowATSModal(false)} style={{ background: '#f5f5f5', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>
            {atsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔍</div>
                <p>Analyzing your resume with AI...</p>
              </div>
            ) : atsResult ? (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '30px', padding: '30px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '15px', color: 'white' }}>
                  <div style={{ fontSize: '4rem', fontWeight: 'bold' }}>{atsResult.overallScore}<span style={{ fontSize: '1.5rem' }}>/100</span></div>
                  <div style={{ fontSize: '1.5rem', marginTop: '10px' }}>Grade: {atsResult.grade}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>{atsResult.atsCompatibility}%</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>ATS Compatible</div>
                  </div>
                  <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>{atsResult.keywordMatch}%</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Keyword Match</div>
                  </div>
                  <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>{atsResult.formatting}%</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Formatting</div>
                  </div>
                  <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>{atsResult.contentQuality}%</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Content</div>
                  </div>
                </div>
                {atsResult.strengths && (
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ color: '#11998e', marginBottom: '10px' }}>✅ Strengths</h3>
                    <ul style={{ paddingLeft: '20px' }}>{atsResult.strengths.map((s, i) => <li key={i} style={{ color: '#333', marginBottom: '5px' }}>{s}</li>)}</ul>
                  </div>
                )}
                {atsResult.improvements && (
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ color: '#ee5a6f', marginBottom: '10px' }}>🔧 Improvements</h3>
                    <ul style={{ paddingLeft: '20px' }}>{atsResult.improvements.map((s, i) => <li key={i} style={{ color: '#333', marginBottom: '5px' }}>{s}</li>)}</ul>
                  </div>
                )}
                {atsResult.missingKeywords && (
                  <div>
                    <h3 style={{ color: '#ff9800', marginBottom: '10px' }}>🔑 Missing Keywords</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {atsResult.missingKeywords.map((k, i) => <span key={i} style={{ background: '#fff3e0', color: '#e65100', padding: '6px 12px', borderRadius: '15px', fontSize: '13px' }}>{k}</span>)}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px', maxWidth: '1600px', margin: '0 auto' }} className="editor-grid">
        <div style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }} className="no-print">
          <div style={{ display: 'flex', background: '#f8f9fa', borderBottom: '1px solid #e0e0e0', overflowX: 'auto' }}>
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{ padding: '15px 20px', background: activeSection === s.id ? 'white' : 'transparent', border: 'none', borderBottom: activeSection === s.id ? '3px solid #667eea' : '3px solid transparent', cursor: 'pointer', fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', color: activeSection === s.id ? '#667eea' : '#666' }}>{s.label}</button>
            ))}
          </div>
          <div style={{ padding: '25px' }}>
            {activeSection === 'personal' && (
              <div>
                <h2 style={{ color: '#1a1a2e', marginBottom: '20px' }}>Personal Information</h2>
                <label style={labelStyle}>Full Name *</label><input type="text" value={resume.personal.fullName} onChange={(e) => updatePersonal('fullName', e.target.value)} placeholder="John Doe" style={inputStyle} />
                <label style={labelStyle}>Job Title *</label><input type="text" value={resume.personal.jobTitle} onChange={(e) => updatePersonal('jobTitle', e.target.value)} placeholder="Software Engineer" style={inputStyle} />
                <label style={labelStyle}>Email *</label><input type="email" value={resume.personal.email} onChange={(e) => updatePersonal('email', e.target.value)} placeholder="john@example.com" style={inputStyle} />
                <label style={labelStyle}>Phone</label><input type="text" value={resume.personal.phone} onChange={(e) => updatePersonal('phone', e.target.value)} placeholder="+91 9876543210" style={inputStyle} />
                <label style={labelStyle}>Location</label><input type="text" value={resume.personal.location} onChange={(e) => updatePersonal('location', e.target.value)} placeholder="Mumbai, India" style={inputStyle} />
                <label style={labelStyle}>LinkedIn</label><input type="text" value={resume.personal.linkedin} onChange={(e) => updatePersonal('linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" style={inputStyle} />
                <label style={labelStyle}>Website</label><input type="text" value={resume.personal.website} onChange={(e) => updatePersonal('website', e.target.value)} placeholder="johndoe.com" style={inputStyle} />
              </div>
            )}
            {activeSection === 'summary' && (
              <div>
                <h2 style={{ color: '#1a1a2e', marginBottom: '10px' }}>Professional Summary</h2>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Click "AI Generate" above to regenerate</p>
                <textarea value={resume.summary} onChange={(e) => setResume(prev => ({ ...prev, summary: e.target.value }))} placeholder="Experienced..." style={{ ...inputStyle, minHeight: '200px' }} />
              </div>
            )}
            {activeSection === 'experience' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ color: '#1a1a2e' }}>Work Experience</h2>
                  <button onClick={addExperience} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>+ Add</button>
                </div>
                {resume.experience.length === 0 && <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>No experience added yet.</p>}
                {resume.experience.map((exp, index) => (
                  <div key={exp.id} style={{ border: '1px solid #e0e0e0', padding: '20px', borderRadius: '10px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <strong>Experience #{index + 1}</strong>
                      <button onClick={() => removeExperience(exp.id)} style={{ background: '#fee', color: '#c00', border: 'none', padding: '4px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                    </div>
                    <label style={labelStyle}>Company</label><input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Google" style={inputStyle} />
                    <label style={labelStyle}>Role</label><input type="text" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} placeholder="Software Engineer" style={inputStyle} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div><label style={labelStyle}>Start</label><input type="text" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="Jan 2020" style={inputStyle} /></div>
                      <div><label style={labelStyle}>End</label><input type="text" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="Present" style={inputStyle} /></div>
                    </div>
                    <label style={labelStyle}>Description</label>
                    <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} placeholder="• Led team..." style={{ ...inputStyle, minHeight: '100px' }} />
                  </div>
                ))}
              </div>
            )}
            {activeSection === 'education' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ color: '#1a1a2e' }}>Education</h2>
                  <button onClick={addEducation} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>+ Add</button>
                </div>
                {resume.education.length === 0 && <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>No education added yet.</p>}
                {resume.education.map((edu, index) => (
                  <div key={edu.id} style={{ border: '1px solid #e0e0e0', padding: '20px', borderRadius: '10px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <strong>Education #{index + 1}</strong>
                      <button onClick={() => removeEducation(edu.id)} style={{ background: '#fee', color: '#c00', border: 'none', padding: '4px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                    </div>
                    <label style={labelStyle}>Institution</label><input type="text" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} placeholder="Mumbai University" style={inputStyle} />
                    <label style={labelStyle}>Degree</label><input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Bachelor of Engineering" style={inputStyle} />
                    <label style={labelStyle}>Field</label><input type="text" value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} placeholder="Computer Science" style={inputStyle} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      <div><label style={labelStyle}>Start</label><input type="text" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} placeholder="2018" style={inputStyle} /></div>
                      <div><label style={labelStyle}>End</label><input type="text" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} placeholder="2022" style={inputStyle} /></div>
                      <div><label style={labelStyle}>Grade</label><input type="text" value={edu.grade} onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)} placeholder="8.5" style={inputStyle} /></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeSection === 'skills' && (
              <div>
                <h2 style={{ color: '#1a1a2e', marginBottom: '10px' }}>Skills</h2>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Type a skill and press Enter</p>
                <input type="text" placeholder="React, Python..." onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value.trim()) { addSkill(e.target.value.trim()); e.target.value = '' } }} style={inputStyle} />
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
                  {resume.skills.map(skill => (
                    <div key={skill} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '8px 14px', borderRadius: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {skill}
                      <button onClick={() => removeSkill(skill)} style={{ background: 'rgba(255,255,255,0.3)', border: 'none', color: 'white', width: '20px', height: '20px', borderRadius: '50%', cursor: 'pointer', fontSize: '12px' }}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeSection === 'projects' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ color: '#1a1a2e' }}>Projects</h2>
                  <button onClick={addProject} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>+ Add</button>
                </div>
                {resume.projects.length === 0 && <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>No projects added yet.</p>}
                {resume.projects.map((proj, index) => (
                  <div key={proj.id} style={{ border: '1px solid #e0e0e0', padding: '20px', borderRadius: '10px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <strong>Project #{index + 1}</strong>
                      <button onClick={() => removeProject(proj.id)} style={{ background: '#fee', color: '#c00', border: 'none', padding: '4px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                    </div>
                    <label style={labelStyle}>Name</label><input type="text" value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)} placeholder="E-commerce" style={inputStyle} />
                    <label style={labelStyle}>Tech</label><input type="text" value={proj.tech} onChange={(e) => updateProject(proj.id, 'tech', e.target.value)} placeholder="React, Node.js" style={inputStyle} />
                    <label style={labelStyle}>Link</label><input type="text" value={proj.link} onChange={(e) => updateProject(proj.id, 'link', e.target.value)} placeholder="github.com" style={inputStyle} />
                    <label style={labelStyle}>Description</label>
                    <textarea value={proj.description} onChange={(e) => updateProject(proj.id, 'description', e.target.value)} placeholder="Brief description" style={{ ...inputStyle, minHeight: '80px' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '15px', padding: '40px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', minHeight: '800px' }} id="resume-preview">
          <div style={{ borderBottom: '3px solid #667eea', paddingBottom: '20px', marginBottom: '25px' }}>
            <h1 style={{ fontSize: '2.5rem', color: '#1a1a2e', marginBottom: '5px' }}>{resume.personal.fullName || 'Your Name'}</h1>
            <p style={{ fontSize: '1.2rem', color: '#667eea', marginBottom: '15px', fontWeight: '500' }}>{resume.personal.jobTitle || 'Your Job Title'}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', fontSize: '14px', color: '#666' }}>
              {resume.personal.email && <span>📧 {resume.personal.email}</span>}
              {resume.personal.phone && <span>📱 {resume.personal.phone}</span>}
              {resume.personal.location && <span>📍 {resume.personal.location}</span>}
              {resume.personal.linkedin && <span>💼 {resume.personal.linkedin}</span>}
              {resume.personal.website && <span>🌐 {resume.personal.website}</span>}
            </div>
          </div>
          {resume.summary && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ color: '#667eea', fontSize: '1.3rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Summary</h2>
              <p style={{ color: '#333', lineHeight: '1.6' }}>{resume.summary}</p>
            </div>
          )}
          {resume.experience.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ color: '#667eea', fontSize: '1.3rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Experience</h2>
              {resume.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><h3 style={{ color: '#1a1a2e', fontSize: '1.1rem' }}>{exp.role || 'Role'}</h3><p style={{ color: '#667eea', fontWeight: '500' }}>{exp.company || 'Company'}</p></div>
                    <p style={{ color: '#999', fontSize: '14px' }}>{exp.startDate} {exp.startDate && '-'} {exp.endDate}</p>
                  </div>
                  <p style={{ color: '#555', marginTop: '8px', whiteSpace: 'pre-line', lineHeight: '1.6' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          )}
          {resume.education.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ color: '#667eea', fontSize: '1.3rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Education</h2>
              {resume.education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><h3 style={{ color: '#1a1a2e', fontSize: '1.1rem' }}>{edu.degree} {edu.field && `in ${edu.field}`}</h3><p style={{ color: '#667eea' }}>{edu.institution}</p></div>
                    <p style={{ color: '#999', fontSize: '14px' }}>{edu.startDate} - {edu.endDate}</p>
                  </div>
                  {edu.grade && <p style={{ color: '#666', fontSize: '14px' }}>Grade: {edu.grade}</p>}
                </div>
              ))}
            </div>
          )}
          {resume.skills.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ color: '#667eea', fontSize: '1.3rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{resume.skills.map(skill => <span key={skill} style={{ background: '#f0f0ff', color: '#667eea', padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: '500' }}>{skill}</span>)}</div>
            </div>
          )}
          {resume.projects.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ color: '#667eea', fontSize: '1.3rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Projects</h2>
              {resume.projects.map(proj => (
                <div key={proj.id} style={{ marginBottom: '15px' }}>
                  <h3 style={{ color: '#1a1a2e', fontSize: '1.1rem' }}>{proj.name}</h3>
                  {proj.tech && <p style={{ color: '#667eea', fontSize: '14px', marginBottom: '5px' }}>{proj.tech}</p>}
                  {proj.description && <p style={{ color: '#555', lineHeight: '1.6' }}>{proj.description}</p>}
                  {proj.link && <a href={proj.link} style={{ color: '#667eea', fontSize: '14px' }}>🔗 {proj.link}</a>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .editor-grid { display: block !important; padding: 0 !important; }
          #resume-preview { box-shadow: none !important; border-radius: 0 !important; }
        }
        @media (max-width: 768px) { .editor-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

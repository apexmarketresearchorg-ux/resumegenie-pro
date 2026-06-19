export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
        ResumeGenie Pro
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
        AI Powered Resume Builder
      </p>
      <p style={{ fontSize: '1rem', opacity: 0.8 }}>
        Coming Soon - Building Something Amazing!
      </p>
    </main>
  )
}

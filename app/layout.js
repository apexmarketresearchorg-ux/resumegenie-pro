export const metadata = {
  title: 'ResumeGenie Pro - AI Resume Builder',
  description: 'Build perfect resumes in 30 seconds with AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}

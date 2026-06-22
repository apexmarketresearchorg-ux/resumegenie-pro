import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { resume, jobDescription } = await request.json()

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume content is required' },
        { status: 400 }
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    
    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze this resume and provide a detailed score and feedback.

RESUME DATA:
${JSON.stringify(resume, null, 2)}

JOB DESCRIPTION (if provided):
${jobDescription || 'Not provided - analyze for general professional standards'}

Return a JSON object with this EXACT structure (no markdown, just pure JSON):
{
  "overallScore": number between 0-100,
  "grade": "A+/A/B/C/D/F based on score",
  "atsCompatibility": number between 0-100,
  "keywordMatch": number between 0-100,
  "formatting": number between 0-100,
  "contentQuality": number between 0-100,
  "strengths": [
    "list of 3-5 strong points in the resume"
  ],
  "improvements": [
    "list of 5-7 specific actionable improvements"
  ],
  "missingKeywords": [
    "list of 5-10 important keywords missing"
  ],
  "suggestions": {
    "summary": "Specific tip to improve summary",
    "experience": "Specific tip to improve experience section",
    "skills": "Specific tip to improve skills",
    "overall": "One main suggestion to dramatically improve"
  }
}

Be honest, specific, and actionable. Focus on what will help them get hired.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    const data = JSON.parse(text)

    return NextResponse.json({ 
      success: true, 
      data 
    })

  } catch (error) {
    console.error('ATS Score Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to analyze resume' 
      },
      { status: 500 }
    )
  }
}

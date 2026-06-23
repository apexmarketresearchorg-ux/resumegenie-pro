import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(request) {
  try {
    const { resume, jobDescription } = await request.json()

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume content is required' },
        { status: 400 }
      )
    }

    const prompt = `You are an expert ATS analyzer. Analyze this resume and provide detailed score and feedback.

RESUME DATA:
${JSON.stringify(resume, null, 2)}

JOB DESCRIPTION:
${jobDescription || 'Not provided - analyze for general professional standards'}

Return ONLY a JSON object (no markdown) with this EXACT structure:
{
  "overallScore": 75,
  "grade": "B",
  "atsCompatibility": 80,
  "keywordMatch": 70,
  "formatting": 85,
  "contentQuality": 75,
  "strengths": [
    "strength 1",
    "strength 2",
    "strength 3"
  ],
  "improvements": [
    "improvement 1",
    "improvement 2",
    "improvement 3",
    "improvement 4",
    "improvement 5"
  ],
  "missingKeywords": [
    "keyword1",
    "keyword2",
    "keyword3"
  ],
  "suggestions": {
    "summary": "tip for summary",
    "experience": "tip for experience",
    "skills": "tip for skills",
    "overall": "main improvement tip"
  }
}

Be honest, specific, and actionable. Score 0-100. Grade A+/A/B/C/D/F.`

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert ATS analyzer. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    })

    const text = completion.choices[0].message.content
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

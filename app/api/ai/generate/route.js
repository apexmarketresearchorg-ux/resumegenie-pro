import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(request) {
  try {
    const { jobTitle, experience, skills } = await request.json()

    if (!jobTitle) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      )
    }

    const prompt = `You are a professional resume writer. Create a complete professional resume for someone with these details:

Job Title: ${jobTitle}
Years of Experience: ${experience || 'Not specified'}
Skills: ${skills || 'General'}

Return ONLY a JSON object (no markdown, no explanation, just pure JSON) with this EXACT structure:
{
  "summary": "A compelling 3-4 sentence professional summary",
  "experience": [
    {
      "company": "Realistic company name",
      "role": "Job title",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "description": "• 3-4 bullet points with quantified achievements\\n• Use strong action verbs\\n• Include metrics"
    }
  ],
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8"],
  "education": [
    {
      "institution": "University name",
      "degree": "Degree name",
      "field": "Field of study",
      "startDate": "Year",
      "endDate": "Year",
      "grade": "Grade"
    }
  ]
}

Make it ATS-friendly with relevant keywords. Include 2 work experiences if experienced, 1 if fresher. Use realistic company names.`

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a professional resume writer. Always respond with valid JSON only, no markdown.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
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
    console.error('AI Generation Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate resume' 
      },
      { status: 500 }
    )
  }
}

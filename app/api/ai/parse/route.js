import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(request) {
  try {
    const { resumeText } = await request.json()

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Resume content too short. Please paste full resume.' },
        { status: 400 }
      )
    }

    const prompt = `You are an expert resume parser. Extract information from this resume text and structure it properly. Also improve the content while extracting.

RESUME TEXT:
${resumeText}

Extract and improve:
1. Personal information
2. Professional summary (improve it if weak)
3. Work experience (enhance descriptions with action verbs and metrics)
4. Education
5. Skills (expand if too few)
6. Projects (if mentioned)

Return ONLY a JSON object (no markdown) with this EXACT structure:
{
  "personal": {
    "fullName": "extracted name",
    "jobTitle": "current or target job title",
    "email": "extracted email",
    "phone": "extracted phone",
    "location": "extracted location",
    "linkedin": "extracted linkedin or empty",
    "website": "extracted website or empty"
  },
  "summary": "improved professional summary based on resume",
  "experience": [
    {
      "company": "company name",
      "role": "job title",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "description": "improved bullet points with metrics\\n• Strong action verbs\\n• Quantified achievements"
    }
  ],
  "education": [
    {
      "institution": "school name",
      "degree": "degree",
      "field": "field of study",
      "startDate": "year",
      "endDate": "year",
      "grade": "grade if mentioned"
    }
  ],
  "skills": ["list of all skills mentioned plus relevant additional ones"],
  "projects": [
    {
      "name": "project name",
      "tech": "technologies used",
      "link": "link if any",
      "description": "project description"
    }
  ]
}

Be thorough and extract EVERYTHING. If something is missing in original resume, use empty string. CRITICAL: Return valid JSON only.`

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert resume parser. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 3000,
      response_format: { type: 'json_object' }
    })

    const text = completion.choices[0].message.content
    const data = JSON.parse(text)

    return NextResponse.json({ 
      success: true, 
      data 
    })

  } catch (error) {
    console.error('Parse Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to parse resume' 
      },
      { status: 500 }
    )
  }
}

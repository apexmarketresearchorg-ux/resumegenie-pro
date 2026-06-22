import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { jobTitle, experience, skills } = await request.json()

    if (!jobTitle) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `You are a professional resume writer. Create a complete professional resume for someone with these details:

Job Title: ${jobTitle}
Years of Experience: ${experience || 'Not specified'}
Skills: ${skills || 'General'}

Return a JSON object with this EXACT structure (no markdown, just pure JSON):
{
  "summary": "A compelling 3-4 sentence professional summary highlighting key strengths and value proposition",
  "experience": [
    {
      "company": "Realistic company name",
      "role": "Job title matching the role",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "description": "• 3-4 bullet points with quantified achievements\\n• Use strong action verbs\\n• Include metrics and results\\n• Show impact and value created"
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

Make it ATS-friendly with relevant keywords for ${jobTitle}. Include 2 work experiences if experienced, 1 if fresher. Use realistic Indian/Global company names. Make achievements specific and quantified.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    // Clean the response (remove markdown if any)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

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

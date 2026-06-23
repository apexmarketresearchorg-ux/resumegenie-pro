import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(request) {
  try {
    const { resume, improvements, missingKeywords } = await request.json()

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume is required' },
        { status: 400 }
      )
    }

    const prompt = `You are an expert resume writer. Improve this resume by applying ALL the suggested improvements and adding missing keywords naturally.

CURRENT RESUME:
${JSON.stringify(resume, null, 2)}

IMPROVEMENTS TO APPLY:
${(improvements || []).map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

MISSING KEYWORDS TO ADD NATURALLY:
${(missingKeywords || []).join(', ')}

Instructions:
1. Improve the summary to be more impactful
2. Enhance experience descriptions with specific metrics and numbers
3. Add quantified achievements (use numbers, percentages, dollar amounts)
4. Naturally incorporate missing keywords into experience and skills
5. Use strong action verbs (Led, Spearheaded, Achieved, Delivered, etc.)
6. Make every bullet point start with action verb
7. Keep all personal information EXACTLY as is
8. Keep education EXACTLY as is unless adding relevant certifications
9. Make skills list more comprehensive and relevant

Return ONLY a JSON object (no markdown) with this EXACT structure:
{
  "personal": {
    "fullName": "keep same",
    "jobTitle": "keep or enhance",
    "email": "keep same",
    "phone": "keep same",
    "location": "keep same",
    "linkedin": "keep same",
    "website": "keep same"
  },
  "summary": "improved compelling summary with keywords",
  "experience": [
    {
      "company": "same",
      "role": "same or enhanced",
      "startDate": "same",
      "endDate": "same",
      "description": "improved with metrics and keywords"
    }
  ],
  "education": [keep all education entries same],
  "skills": ["expanded skills list with missing keywords"],
  "projects": [keep or enhance with metrics]
}

CRITICAL: Return valid JSON only, no explanations.`

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert resume writer. Always respond with valid JSON only, no markdown.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
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
    console.error('Improve Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to improve resume' 
      },
      { status: 500 }
    )
  }
}

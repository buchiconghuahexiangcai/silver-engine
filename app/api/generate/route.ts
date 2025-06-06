import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
})

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: '缺少提示词' },
        { status: 400 }
      )
    }

    const completion = await client.chat.completions.create({
      extra_headers: {
        'HTTP-Referer': 'https://chaojiabaoying.com',
        'X-Title': '吵架包赢',
      },
      model: 'deepseek/deepseek-chat-v3-0324:free',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500,
    })

    const content = completion.choices[0]?.message?.content || ''
    
    return NextResponse.json({ content })
    
  } catch (error) {
    console.error('API调用错误:', error)
    return NextResponse.json(
      { error: '生成反击内容失败' },
      { status: 500 }
    )
  }
} 
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  opponentWords: string;
  intensity: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RequestBody;
    const { opponentWords, intensity } = body;

    if (!opponentWords) {
      return NextResponse.json(
        { error: "对方的话不能为空" },
        { status: 400 }
      );
    }

    const intensityLevel = Number(intensity) || 5;
    
    // OpenRouter API integration
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY || "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"}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://example.com", 
        "X-Title": "Argument Assistant", 
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "system",
            content: `你是一个专业的吵架助手，擅长生成有力的吵架回复。
            你需要针对用户提供的对方说的话，生成3条不同的回复建议。
            语气强烈程度从1到10，${intensityLevel}级。
            语气强度为1时非常温和有礼貌，语气强度为10时非常强势，但避免使用粗俗和不文明的语言。
            回复要巧妙地反驳对方，既有理有据又能站在道德高地，让对方哑口无言。
            回复要符合中文互联网表达习惯，自然流畅。
            直接输出3条回复，每条一段，无需编号或其他格式。`
          },
          {
            role: "user",
            content: opponentWords
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json(
        { error: "AI服务暂时不可用，请稍后再试" },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    // Process the response to extract the 3 arguments
    const content = data.choices[0].message.content;
    const responses = content
      .split(/\n+/)
      .filter((line: string) => line.trim().length > 0)
      .slice(0, 3);

    return NextResponse.json({ responses });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "服务器处理请求时出错" },
      { status: 500 }
    );
  }
}
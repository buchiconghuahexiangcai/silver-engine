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
    
    // 检查API密钥
    const apiKey = process.env.OPENROUTER_API_KEY || "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";
    
    if (!apiKey) {
      console.error("未设置OpenRouter API密钥");
      // 返回模拟响应
      const mockResponses = [
        `你这个观点确实有失偏颇。从逻辑层面来看，任何结论都需要充分的事实支撑，而你提出的论点缺乏足够的论证基础。建议你先完善自己的论据再来讨论。`,
        `我理解你的想法，但恐怕你对这个问题的理解还不够深入。真正的智慧在于承认自己的无知，然后去学习和成长。希望你能以更开放的心态来看待不同的观点。`,
        `这个问题比你想象的要复杂得多。虽然你的观点有一定道理，但显然忽略了很多重要因素。建议你多角度思考问题，这样才能得出更全面的结论。`
      ];
      return NextResponse.json({ responses: mockResponses });
    }
    
    let response;
    // OpenRouter API integration
    try {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://example.com", 
          "X-Title": "Argument Assistant", 
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: [
            {
              role: "system",
              content: `你是一个专业的吵架助手，擅长生成有力的吵架回复。

任务：针对用户提供的对方说的话，生成3条不同的回复建议。

回复要求：
1. 语气强烈程度：${intensityLevel}/10级（1为非常温和，10为非常强势）
2. 避免使用粗俗和不文明的语言
3. 回复要巧妙地反驳对方，既有理有据又能站在道德高地
4. 符合中文互联网表达习惯，自然流畅

输出格式：直接输出3条回复，每条一段，中间用空行分隔，无需编号或其他额外标记。`
            },
            {
              role: "user",
              content: `对方说：${opponentWords}\n\n请给我3条不同的吵架回复，用空行分隔。`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { error: "网络请求失败，无法连接到AI服务" },
        { status: 500 }
      );
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      
      // 如果是认证错误，返回模拟响应用于测试
      if (errorData.error?.code === 401) {
        console.log("API密钥无效，使用模拟响应进行测试");
        const mockResponses = [
          `你这个观点确实有失偏颇。从逻辑层面来看，任何结论都需要充分的事实支撑，而你提出的论点缺乏足够的论证基础。建议你先完善自己的论据再来讨论。`,
          `我理解你的想法，但恐怕你对这个问题的理解还不够深入。真正的智慧在于承认自己的无知，然后去学习和成长。希望你能以更开放的心态来看待不同的观点。`,
          `这个问题比你想象的要复杂得多。虽然你的观点有一定道理，但显然忽略了很多重要因素。建议你多角度思考问题，这样才能得出更全面的结论。`
        ];
        return NextResponse.json({ responses: mockResponses });
      }
      
      return NextResponse.json(
        { error: `AI服务暂时不可用: ${errorData.error?.message || "未知错误"}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    // Process the response to extract the 3 arguments
    const content = data.choices[0].message.content;
    console.log("API返回内容:", content);

    // 更健壮的响应处理
    let responses = [];
    
    // 尝试多种方式分割响应
    // 1. 通过空行分割 (首选方式)
    const splitByEmptyLine = content.split(/\n\s*\n/).filter((text: string) => text.trim().length > 0);
    if (splitByEmptyLine.length > 0) {
      console.log("使用空行分割成功，得到", splitByEmptyLine.length, "条回复");
      responses = splitByEmptyLine.slice(0, 3);
    } 
    // 2. 通过换行符分割
    else {
      const splitByNewline = content
        .split(/\n/)
        .filter((line: string) => line.trim().length > 0)
        .slice(0, 3);
      
      if (splitByNewline.length > 0) {
        console.log("使用换行符分割成功，得到", splitByNewline.length, "条回复");
        responses = splitByNewline;
      }
      // 3. 如果上述方法都不成功，将整个内容作为一条回复
      else {
        console.log("无法分割回复，将整个内容作为一条回复");
        responses = [content.trim()];
      }
    }
    
    // 确保至少有一条回复
    if (responses.length === 0) {
      console.log("没有生成有效回复");
      responses = ["AI无法生成有效回复，请尝试不同的输入或联系管理员。"];
    }

    console.log("处理后的回复:", responses);
    return NextResponse.json({ responses });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "服务器处理请求时出错" },
      { status: 500 }
    );
  }
}
'use client'

import { useState } from 'react'

// 名嘴选项
const speakers = [
  { id: 'luyu', name: '鲁豫', style: '温和但犀利' },
  { id: 'jinxing', name: '金星', style: '毒舌直接' },
  { id: 'dapeng', name: '大鹏', style: '幽默讽刺' },
  { id: 'liujialin', name: '刘家林', style: '逻辑严密' },
  { id: 'mazhi', name: '马薇薇', style: '机智反击' },
  { id: 'default', name: '普通风格', style: '直来直去' }
]

interface Response {
  content: string
  timestamp: number
}

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [intensity, setIntensity] = useState(5)
  const [selectedSpeaker, setSelectedSpeaker] = useState('default')
  const [responses, setResponses] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 从localStorage获取历史记录
  const loadHistory = () => {
    try {
      const history = localStorage.getItem('chaojiabaoying-history')
      return history ? JSON.parse(history) : []
    } catch {
      return []
    }
  }

  // 保存到localStorage
  const saveToHistory = (newResponses: Response[]) => {
    try {
      const history = loadHistory()
      const newHistory = [...history, ...newResponses].slice(-50) // 只保留最近50条
      localStorage.setItem('chaojiabaoying-history', JSON.stringify(newHistory))
    } catch {
      console.log('保存历史记录失败')
    }
  }

  // 生成提示词
  const generatePrompt = (opponentText: string, speaker: string, intensityLevel: number) => {
    const speakerInfo = speakers.find(s => s.id === speaker) || speakers[speakers.length - 1]
    
    return `你是一个专业的辩论和反击专家。现在需要你帮助用户回击对方的话。

用户被对方说了："${opponentText}"

请按照以下要求生成3条反击语句：

1. 风格：模仿${speakerInfo.name}的说话风格（${speakerInfo.style}）
2. 强度等级：${intensityLevel}/10（1为温和，10为最强烈）
3. 要求：
   - 每条回击都要有理有据，不能无理取闹
   - 要体现智慧和逻辑，而不是简单的谩骂
   - 要让对方哑口无言
   - 语言要生动有力，但不要过于粗俗
   - 要有层次感，从不同角度反击

请只返回3条反击语句，每条一行，不要添加任何编号或额外说明。`
  }

  // 调用API生成反击内容
  const generateResponses = async () => {
    if (!inputText.trim()) {
      alert('请输入对方说的话')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: generatePrompt(inputText.trim(), selectedSpeaker, intensity)
        }),
      })

      if (!response.ok) {
        throw new Error('API调用失败')
      }

      const data = await response.json()
      const responseLines = data.content.split('\n').filter((line: string) => line.trim())
      
      const newResponses: Response[] = responseLines.map((content: string) => ({
        content: content.trim(),
        timestamp: Date.now()
      }))

      setResponses(newResponses)
      saveToHistory(newResponses)
      
    } catch (error) {
      console.error('生成反击失败:', error)
      alert('生成反击失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 复制文本
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('已复制到剪贴板')
    }).catch(() => {
      alert('复制失败')
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wechat-light to-white">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-wechat-text mb-2">🗯️ 吵架包赢</h1>
          <p className="text-gray-600 text-sm">AI助你反击，让你在任何争吵中都能占据上风</p>
        </div>

        {/* 输入区域 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block text-wechat-text font-medium mb-2">对方说了什么？</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="输入对方骂你的话或者让你不爽的话..."
              className="w-full p-3 border border-wechat-gray rounded-xl resize-none focus:outline-none focus:border-wechat-green transition-colors"
              rows={4}
            />
          </div>

          <div className="mb-4">
            <label className="block text-wechat-text font-medium mb-3">
              语气强烈程度：<span className="text-wechat-green font-bold">{intensity}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>温和</span>
              <span>适中</span>
              <span>强烈</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-wechat-text font-medium mb-3">选择反击风格</label>
            <div className="grid grid-cols-2 gap-2">
              {speakers.map((speaker) => (
                <button
                  key={speaker.id}
                  onClick={() => setSelectedSpeaker(speaker.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedSpeaker === speaker.id
                      ? 'border-wechat-green bg-wechat-green text-white'
                      : 'border-wechat-gray bg-white text-wechat-text hover:border-wechat-green'
                  }`}
                >
                  <div className="font-medium">{speaker.name}</div>
                  <div className="text-xs opacity-75">{speaker.style}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateResponses}
            disabled={isLoading || !inputText.trim()}
            className="w-full bg-wechat-green text-white py-4 rounded-xl font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
          >
            {isLoading ? (
              <span className="loading-dots">生成中...</span>
            ) : (
              '🚀 开始吵架'
            )}
          </button>
        </div>

        {/* 响应结果 */}
        {responses.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 fade-in">
            <h3 className="text-lg font-bold text-wechat-text mb-4 flex items-center">
              <span className="mr-2">💥</span>
              反击语句
            </h3>
            <div className="space-y-4">
              {responses.map((response, index) => (
                <div key={index} className="bg-gradient-to-r from-wechat-green to-green-500 rounded-xl p-4 text-white">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                      反击 #{index + 1}
                    </span>
                    <button
                      onClick={() => copyText(response.content)}
                      className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded"
                    >
                      📋
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed">{response.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 底部信息 */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>⚠️ 仅供娱乐，理性对话才是最好的解决方式</p>
        </div>
      </div>
    </div>
  )
} 
import type { ResumeContext } from '~/types/resume'
import { resumeContext } from '~/constants/resume'

export const useGemini = () => {
  const config = useRuntimeConfig()
  const apiKey = config.public.geminiApiKey || ''

  const callGemini = async (prompt: string, systemInstruction = ''): Promise<string> => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
    }

    try {
      const response = await $fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      })

      // Type assertion for the response
      type GeminiResponse = {
        candidates?: Array<{
          content?: {
            parts?: Array<{
              text?: string
            }>
          }
        }>
      }

      const data = response as GeminiResponse
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'AI 暂时无法回应，请稍后再试。'
    } catch (error) {
      console.error('Gemini API Error:', error)
      return '网络错误，无法连接到 AI 服务。'
    }
  }

  const analyzeJobMatch = async (jobDescription: string): Promise<{ score: number; content: string } | null> => {
    if (!jobDescription || !apiKey) {
      return null
    }

    const systemPrompt = `你是一位专业的招聘顾问。你的任务是将候选人(高一帆)的简历与用户提供的职位描述(JD)进行匹配。

候选人简历数据: ${JSON.stringify(resumeContext)}

请以 JSON 格式输出(不要包含Markdown代码块标记)，包含两个字段:
1. "score": 一个0-100的整数，表示匹配度。
2. "content": 一段Markdown格式的分析文本。
   - 第一部分：列出3个核心匹配点（使用无序列表）。
   - 第二部分：一段简短有力的自我推荐语（Pitch），结合候选人的心理学背景或AI能力，说明为什么适合这个岗位。
`

    try {
      const resultText = await callGemini(jobDescription, systemPrompt)
      // Clean up JSON if LLM adds backticks
      const jsonStr = resultText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()

      return JSON.parse(jsonStr) as { score: number; content: string }
    } catch (e) {
      console.error('Parse Error:', e)
      return {
        score: 0,
        content: '解析结果失败，请重试。',
      }
    }
  }

  const chatWithResume = async (userMessage: string): Promise<string> => {
    if (!userMessage || !apiKey) {
      return '请确保 API Key 已配置。'
    }

    const systemPrompt = `你扮演求职者"高一帆"。请用热情、自信、专业的口吻回答招聘者的问题。
请简短回答（不要超过3句话），除非被问及具体技术细节。

你的资料库: ${JSON.stringify(resumeContext)}

关键性格特质:
1. 心理学背景：擅长同理心，关注用户体验。
2. AI Native：擅长使用AI工具提高效率。
3. 自驱力强：自学能力强。

如果被问到不知道的事情，就说"这个问题超出了我的当前知识库，但我学得很快！"。
`

    return await callGemini(userMessage, systemPrompt)
  }

  return {
    apiKey,
    analyzeJobMatch,
    chatWithResume,
  }
}

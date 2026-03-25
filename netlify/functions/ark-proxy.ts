import type { Context } from '@netlify/functions'



const ARK_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/responses'

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const body = await req.json()
    const apiKey = process.env.RESUME_ARK_API_KEY
    const modelId = process.env.RESUME_ARK_MODEL_ID

    // 显式构造，确保只发送 API 需要的字段
    const requestBody = {
      model: modelId,
      input: body.input, // 确保从前端传来的 body 中提取 input
      stream: body.stream || false
    }

    console.log('[Netlify Function] 转发 Payload:', JSON.stringify(requestBody))

    const response = await fetch(ARK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    // 4. 获取原始响应文本，防止 AI 返回非 JSON 导致崩溃
    const responseText = await response.text()
    
    console.log('[Netlify Function] 火山引擎返回:', responseText)

    // 如果火山引擎报错了，把错误透传给前端方便排查
    if (!response.ok) {
      console.error('[Netlify Function] 火山引擎返回错误:', response.status, responseText)
      // 确保返回有效的 JSON 格式
      return new Response(JSON.stringify({
        error: `Ark API error: ${response.status}`,
        details: responseText
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(responseText, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('Ark proxy error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const config = {
  path: '/api/ark'
}
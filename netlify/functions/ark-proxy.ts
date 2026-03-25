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
    // 1. 获取前端传来的原始数据
    const body = await req.json()

    // 2. 这里的环境变量名必须与 .env 文件中完全一致
    const apiKey = process.env.ARK_API_KEY
    const modelId = process.env.ARK_MODEL_ID

    console.log('[Netlify Function] 环境变量:', { apiKey, modelId })

    if (!apiKey || !modelId) {
      console.error('[Netlify Function] 缺失配置:', { hasApiKey: !!apiKey, hasModelId: !!modelId })
      return new Response(JSON.stringify({ error: 'Server configuration missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 3. 构造发送给火山引擎的最终 Paylaod
    // 确保你的 body 里包含的是 'input' 或 'messages'
    const requestBody = {
      model: modelId,
      ...body
    }

    console.log('[Netlify Function] 正在请求火山引擎...', JSON.stringify(requestBody))

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
    
    // 如果火山引擎报错了，把错误透传给前端方便排查
    if (!response.ok) {
      console.error('[Netlify Function] 火山引擎返回错误:', response.status, responseText)
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
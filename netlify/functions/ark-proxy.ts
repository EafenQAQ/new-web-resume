import type { Context } from '@netlify/functions'

const ARK_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/responses'

export default async (req: Request, context: Context) => {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    // 获取请求体
    const body = await req.json()

    // 从环境变量获取 API Key 和 Model ID
    const apiKey = process.env.ARK_API_KEY
    const modelId = process.env.ARK_MODEL_ID

    if (!apiKey || !modelId) {
      return new Response(JSON.stringify({ error: 'API configuration missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 构建请求体，使用环境变量的 modelId
    const requestBody = {
      model: modelId,
      ...body
    }

    // 转发请求到火山引擎 Ark API
    const response = await fetch(ARK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    // 返回 API 响应
    const data = await response.json()

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Ark proxy error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const config = {
  path: '/api/ark'
}

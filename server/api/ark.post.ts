export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const config = useRuntimeConfig();
  const { arkApiKey, arkModelId } = config;

  // [Log-01] 请求开始
  console.log(`[${requestId}] [ark proxy] 请求开始`, {
    timestamp: new Date().toISOString(),
    arkApiKeyPresent: !!arkApiKey,
    arkModelId,
  });

  if (!arkApiKey || !arkModelId) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] [ark proxy] 配置缺失`, {
      durationMs: duration,
      arkApiKeyPresent: !!arkApiKey,
      arkModelIdPresent: !!arkModelId,
    });
    throw createError({
      statusCode: 500,
      statusMessage: "Server: Ark API Key or Model ID not configured",
    });
  }

  const body = await readBody(event);
  const { input } = body;

  // [Log-02] 请求参数
  console.log(`[${requestId}] [ark proxy] 请求参数`, {
    inputLength: input?.length || 0,
    inputPreview: input?.map((item: any) => ({
      role: item.role,
      contentLength: item.content?.length || 0,
      contentPreview: item.content?.slice(0, 100) || '',
    })),
  });

  if (!input || !Array.isArray(input)) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] [ark proxy] 请求参数无效`, {
      durationMs: duration,
      inputPresent: !!input,
      inputIsArray: Array.isArray(input),
    });
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request: 'input' field is required and must be an array",
    });
  }

  try {
    // [Log-03] 开始调用 Ark API
    const arkApiStartTime = Date.now();
    console.log(`[${requestId}] [ark proxy] 开始调用 Ark API`, {
      url: "https://ark.cn-beijing.volces.com/api/v3/responses",
      arkApiStartTime: new Date(arkApiStartTime).toISOString(),
    });

    const response = await $fetch("https://ark.cn-beijing.volces.com/api/v3/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${arkApiKey}`,
      },
      body: {
        model: arkModelId,
        stream: false,
        input,
      },
      onRequestError({ response, error }) {
        // [Log-04] 网络层错误
        const duration = Date.now() - arkApiStartTime;
        console.error(`[${requestId}] [ark proxy] 网络层错误`, {
          durationMs: duration,
          responseStatus: response?.status,
          responseStatusText: response?.statusText,
          errorMessage: error?.message,
          errorName: error?.name,
          errorCause: error?.cause,
        });
      },
      onResponseError({ response, error }) {
        // [Log-05] HTTP 响应错误（4xx/5xx）
        const duration = Date.now() - arkApiStartTime;
        console.error(`[${requestId}] [ark proxy] HTTP 响应错误`, {
          durationMs: duration,
          responseStatus: response?.status,
          responseStatusText: response?.statusText,
          responseHeaders: response?.headers,
          errorMessage: error?.message,
          errorName: error?.name,
        });
      },
    });

    // [Log-06] 请求成功
    const totalDuration = Date.now() - startTime;
    const responseAny = response as any;
    console.log(`[${requestId}] [ark proxy] 请求成功`, {
      totalDurationMs: totalDuration,
      outputPreview: typeof responseAny?.output === 'string'
        ? responseAny.output.slice(0, 200)
        : JSON.stringify(responseAny?.output).slice(0, 200),
    });

    return response;
  } catch (error: any) {
    const totalDuration = Date.now() - startTime;

    // [Log-07] 捕获错误
    console.error(`[${requestId}] [ark proxy] 捕获错误`, {
      totalDurationMs: totalDuration,
      errorType: error?.name,
      errorMessage: error?.message,
      errorCode: error?.code,
      errorStatus: error?.statusCode || error?.status,
      errorData: error?.data,
      errorCause: error?.cause,
      errorStack: error?.stack?.split('\n').slice(0, 3).join('\n'), // 只记录前3行堆栈
    });

    // 特殊标记：超时可能的原因
    if (totalDuration >= 28000 || totalDuration >= 29000) {
      console.error(`[${requestId}] [ark proxy] 警告：请求时长接近 Netlify 30s 限制`, {
        totalDurationMs: totalDuration,
        warning: "可能触发 Netlify Function 超时限制 (30s)",
      });
    }

    throw createError({
      statusCode: error?.statusCode || error?.status || 502,
      statusMessage: error?.statusMessage || error?.message || "Ark API proxy error",
    });
  }
});

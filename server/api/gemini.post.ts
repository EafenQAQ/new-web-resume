export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const config = useRuntimeConfig();
  const { geminiApiKey } = config;

  // [Log-01] 请求开始
  console.log(`[${requestId}] [gemini proxy] 请求开始`, {
    timestamp: new Date().toISOString(),
    geminiApiKeyPresent: !!geminiApiKey,
  });

  if (!geminiApiKey) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] [gemini proxy] 配置缺失`, {
      durationMs: duration,
      geminiApiKeyPresent: !!geminiApiKey,
    });
    throw createError({
      statusCode: 500,
      statusMessage: "Server: Gemini API Key not configured",
    });
  }

  const body = await readBody(event);
  const { input } = body;

  // [Log-02] 请求参数
  console.log(`[${requestId}] [gemini proxy] 请求参数`, {
    inputLength: input?.length || 0,
    inputPreview: input?.map((item: any) => ({
      role: item.role,
      contentLength: item.content?.length || 0,
      contentPreview: item.content?.slice(0, 100) || '',
    })),
  });

  if (!input || !Array.isArray(input)) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] [gemini proxy] 请求参数无效`, {
      durationMs: duration,
      inputPresent: !!input,
      inputIsArray: Array.isArray(input),
    });
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request: 'input' field is required and must be an array",
    });
  }

  // 转换 Ark 格式为 Gemini 格式
  // Ark: { role: "system"/"user", content: [{ type: "input_text", text: "..." }] }
  // Gemini: { parts: [{ text: "..." }] }, systemInstruction: { parts: [{ text: "..." }] }
  let systemInstructionText = "";
  const contents = input.map((item: any) => {
    if (item.role === "system") {
      systemInstructionText = item.content?.find((c: any) => c.type === "input_text")?.text || "";
      return null; // system 指令不加入 contents
    }
    const text = item.content?.find((c: any) => c.type === "input_text")?.text || "";
    return { parts: [{ text }] };
  }).filter(Boolean);

  // [Log-03] 开始调用 Gemini API
  const geminiApiStartTime = Date.now();
  console.log(`[${requestId}] [gemini proxy] 开始调用 Gemini API`, {
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
    geminiApiStartTime: new Date(geminiApiStartTime).toISOString(),
    hasSystemInstruction: !!systemInstructionText,
    contentsCount: contents.length,
  });

  try {
    const requestBody: any = { contents };
    if (systemInstructionText) {
      requestBody.systemInstruction = { parts: [{ text: systemInstructionText }] };
    }

    const response = await $fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
        onRequestError({ response, error }) {
          // [Log-04] 网络层错误
          const duration = Date.now() - geminiApiStartTime;
          console.error(`[${requestId}] [gemini proxy] 网络层错误`, {
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
          const duration = Date.now() - geminiApiStartTime;
          console.error(`[${requestId}] [gemini proxy] HTTP 响应错误`, {
            durationMs: duration,
            responseStatus: response?.status,
            responseStatusText: response?.statusText,
            responseHeaders: response?.headers,
            errorMessage: error?.message,
            errorName: error?.name,
          });
        },
      },
    );

    // [Log-06] 请求成功
    const totalDuration = Date.now() - startTime;
    const responseAny = response as any;
    const generatedText = responseAny?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log(`[${requestId}] [gemini proxy] 请求成功`, {
      totalDurationMs: totalDuration,
      generatedTextLength: generatedText.length,
      generatedTextPreview: generatedText.slice(0, 200),
    });

    // 转换为与 Ark 相同的响应格式
    return {
      output: [
        {
          type: "message",
          role: "assistant",
          content: [{ type: "output_text", text: generatedText }],
        },
      ],
    };
  } catch (error: any) {
    const totalDuration = Date.now() - startTime;

    // [Log-07] 捕获错误
    console.error(`[${requestId}] [gemini proxy] 捕获错误`, {
      totalDurationMs: totalDuration,
      errorType: error?.name,
      errorMessage: error?.message,
      errorCode: error?.code,
      errorStatus: error?.statusCode || error?.status,
      errorData: error?.data,
      errorCause: error?.cause,
      errorStack: error?.stack?.split('\n').slice(0, 3).join('\n'),
    });

    // 特殊标记：超时可能的原因
    if (totalDuration >= 28000 || totalDuration >= 29000) {
      console.error(`[${requestId}] [gemini proxy] 警告：请求时长接近 Netlify 30s 限制`, {
        totalDurationMs: totalDuration,
        warning: "可能触发 Netlify Function 超时限制 (30s)",
      });
    }

    throw createError({
      statusCode: error?.statusCode || error?.status || 502,
      statusMessage: error?.statusMessage || error?.message || "Gemini API proxy error",
    });
  }
});

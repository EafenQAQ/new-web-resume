export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { arkApiKey, arkModelId } = config;

 
  if (!arkApiKey || !arkModelId) {
    throw createError({
      statusCode: 500,
      statusMessage: "Server: Ark API Key or Model ID not configured",
    });
  }

  const body = await readBody(event);
  const { input } = body;

  if (!input || !Array.isArray(input)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request: 'input' field is required and must be an array",
    });
  }

  try {
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
    });

    return response;
  } catch (error: any) {
    console.error("[ark proxy] Ark API Error:", error?.data || error?.message || error);
    throw createError({
      statusCode: error?.statusCode || 502,
      statusMessage: error?.statusMessage || error?.message || "Ark API proxy error",
    });
  }
});

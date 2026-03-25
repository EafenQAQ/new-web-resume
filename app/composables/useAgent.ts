import type { ResumeContext } from "~/types/resume";
import { resumeContext } from "~/constants/resume";

export const useAgent = () => {
  const config = useRuntimeConfig();
 // 生产环境会注入 NETLIFY = true
const isNetlifyDev = config.public.isNetlifyDev;

// 只有当既不是生产环境，也不是 Netlify 模拟环境时，才视为纯粹的本地开发
const isDev = import.meta.dev && !isNetlifyDev;

  const apiKey = config.public.arkApiKey || "";
  const modelId = config.public.arkModelId || "";

  const callArk = async (
    prompt: string,
    systemInstruction = "",
  ): Promise<string> => {
    // 开发环境: 直接调用 Ark API
    // 生产环境: 调用 Netlify Function 代理
   
    console.log(`[useAgent] 当前环境: ${isDev ? "开发环境" : "生产环境"}`);
    const url = isDev
      ? `https://ark.cn-beijing.volces.com/api/v3/responses`
      : `/api/ark`;
    console.log(`[useAgent] API URL: ${url}`);

    const input: Array<{
      role: string;
      content: Array<{ type: string; text?: string }>;
    }> = [];

    if (systemInstruction) {
      input.push({
        role: "system",
        content: [{ type: "input_text", text: systemInstruction }],
      });
    }

    input.push({
      role: "user",
      content: [{ type: "input_text", text: prompt }],
    });

    const payload = {
      stream: false,
      input: input,
    };

    // 生产环境不需要传 model，由 Netlify Function 处理
    if (isDev) {
      (payload as any).model = modelId;
    }

    try {
      const fetchOptions: any = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      };

      // 开发环境需要添加 Authorization header
      if (isDev) {
        fetchOptions.headers.Authorization = `Bearer ${apiKey}`;
      }

      const response = await $fetch(url, fetchOptions);

      // Type assertion for Ark response
      type ArkContentItem = {
        type: string;
        text?: string;
      };

      type ArkOutputItem = {
        type: string;
        role?: string;
        content?: Array<ArkContentItem>;
        status?: string;
      };

      type ArkResponse = {
        output?: Array<ArkOutputItem>;
        status?: string;
      };

      const data = response as ArkResponse;

      // Find the message output item
      const messageOutput = data.output?.find((item) => item.type === "message");
      if (messageOutput?.content) {
        // Find the output_text content item
        const textContent = messageOutput.content.find(
          (item) => item.type === "output_text",
        );
        if (textContent?.text) {
          return textContent.text;
        }
      }

      return "AI 暂时无法回应，请稍后再试。";
    } catch (error) {
      console.error("Ark API Error:", error);
      return "网络错误，无法连接到 AI 服务。";
    }
  };

  const analyzeJobMatch = async (
    jobDescription: string,
  ): Promise<{ score: number; content: string }> => {
    if (!jobDescription) {
      throw new Error("请输入职位描述");
    }

    // 开发环境需要 API Key，生产环境由 Netlify Function 代理处理
    if (isDev && !apiKey) {
      throw new Error("开发环境需要配置 NUXT_PUBLIC_ARK_API_KEY");
    }

    const systemPrompt = `你是一位专业的招聘顾问。你的任务是将候选人(高一帆)的简历与用户提供的职位描述(JD)进行匹配。

候选人简历数据: ${JSON.stringify(resumeContext)}

请以 JSON 格式输出(不要包含Markdown代码块标记)，包含两个字段:
1. "score": 一个0-100的整数，表示匹配度。
2. "content": 一段Markdown格式的分析文本。
   - 第一部分：列出3个核心匹配点（使用无序列表）。
   - 第二部分：一段简短有力的自我推荐语（Pitch），结合候选人的心理学背景或AI能力，说明为什么适合这个岗位。
`;

    try {
      const resultText = await callArk(jobDescription, systemPrompt);
      // Clean up JSON if LLM adds backticks
      const jsonStr = resultText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(jsonStr) as { score: number; content: string };
    } catch (e) {
      console.error("Parse Error:", e);
      return {
        score: 0,
        content: "解析结果失败，请重试。",
      };
    }
  };

  const chatWithResume = async (userMessage: string): Promise<string> => {
    if (!userMessage || !apiKey) {
      return "请确保 API Key 已配置。";
    }

    const systemPrompt = `你扮演求职者"高一帆"。请用热情、自信、专业的口吻回答招聘者的问题。
请简短回答（不要超过3句话），除非被问及具体技术细节。

你的资料库: ${JSON.stringify(resumeContext)}

关键性格特质:
1. 心理学背景：擅长同理心，关注用户体验。
2. AI Native：擅长使用AI工具提高效率。
3. 自驱力强：自学能力强。

如果被问到不知道的事情，就说"这个问题超出了我的当前知识库，但我学得很快！"。
`;

    return await callArk(userMessage, systemPrompt);
  };

  return {
    apiKey,
    analyzeJobMatch,
    chatWithResume,
  };
};

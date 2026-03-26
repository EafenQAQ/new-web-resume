import { resumeContext } from "~/constants/resume";

type ApiProvider = "ark" | "gemini";

export const useAgent = () => {
  const callAI = async (
    prompt: string,
    systemInstruction = "",
    provider: ApiProvider = "gemini", // 默认使用 Gemini
  ): Promise<string> => {
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

    const apiUrl = provider === "gemini" ? "/api/gemini" : "/api/ark";

    try {
      const response = await $fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          input,
        },
      }) as any;

      // 检查是否为错误响应
      if (response.error) {
        console.error(`[useAgent] ${provider.toUpperCase()} API 返回错误:`, response.error, response.details);
        throw new Error(response.error);
      }

      // Type assertion for response
      type ContentItem = {
        type: string;
        text?: string;
      };

      type OutputItem = {
        type: string;
        role?: string;
        content?: Array<ContentItem>;
        status?: string;
      };

      type AIResponse = {
        output?: Array<OutputItem>;
        status?: string;
      };

      const data = response as AIResponse;

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
    } catch (error: any) {
      console.error(`${provider.toUpperCase()} API Error:`, error);
      throw error;
    }
  };

  const analyzeJobMatch = async (
    jobDescription: string,
    provider: ApiProvider = "gemini",
  ): Promise<{ score: number; content: string }> => {
    if (!jobDescription) {
      throw new Error("请输入职位描述");
    }

    const systemPrompt = `你是一位专业的招聘顾问。你的任务是将候选人(高一帆)的简历与用户提供的职位描述(JD)进行匹配。

候选人简历数据: ${JSON.stringify(resumeContext)}

请以 JSON 格式输出(不要包含Markdown代码块标记)，包含两个字段:
1. "score": 一个0-100的整数，表示匹配度。
2. "content": 一段Markdown格式的分析文本。
   - 第一部分：列出3个核心匹配点（使用无序列表）。
   - 第二部分：一段简短有力的自我推荐语（Pitch），结合候选人的心理学背景或AI能力，说明为什么适合这个岗位。
::`;

    try {
      const resultText = await callAI(jobDescription, systemPrompt, provider);
      // Clean up JSON if LLM adds backticks
      const jsonStr = resultText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(jsonStr) as { score: number; content: string };
    } catch (e: any) {
      console.error("Parse Error:", e);
      return {
        score: 0,
        content: `分析失败: ${e.message || "请重试"}`,
      };
    }
  };

  const chatWithResume = async (
    userMessage: string,
    provider: ApiProvider = "gemini",
  ): Promise<string> => {
    if (!userMessage) {
      return "请输入消息";
    }

    const systemPrompt = `你扮演求职者"高一帆"。请用热情、自信、专业的口吻回答招聘者的问题。
请简短回答（不要超过3句话），除非被问及具体技术细节。

你的资料库: ${JSON.stringify(resumeContext)}

关键性格特质:
1. 心理学背景：擅长同理心，关注用户体验。
2. AI Native：擅长使用AI工具提高效率。
3. 自驱力强：自学能力强。

如果被问到不知道的事情，就说"这个问题超出了我的当前知识库，但我学得很快！"。
::`;

    try {
      return await callAI(userMessage, systemPrompt, provider);
    } catch (e: any) {
      console.error("Chat Error:", e);
      return `抱歉,出现了错误: ${e.message}`;
    }
  };

  return {
    analyzeJobMatch,
    chatWithResume,
  };
};

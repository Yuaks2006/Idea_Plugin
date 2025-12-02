import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client
// Note: In a real production app, ensure the key is present.
// We handle the missing key gracefully in the UI if needed.
const ai = new GoogleGenAI({ apiKey });

export const generateBlessing = async (): Promise<string> => {
  if (!apiKey) {
    return "把我的生日好运分你一半，要天天开心哦！";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "背景：今天是我的生日，我分享这个虚拟蛋糕给朋友。请生成一句**是以我的口吻对朋友说**的祝福语。\n要求：\n1. 必须是“我”分享给“你”的视角。\n2. 内容：分享生日好运、感谢友谊、或希望朋友生活甜蜜。\n3. 语气：超级温柔、治愈、软萌。\n4. 字数：20字以内。\n5. 直接输出句子，不要带引号。",
    });

    return response.text?.trim() || "这块最甜的蛋糕留给你，谢谢你陪我长大！";
  } catch (error) {
    console.error("Error generating blessing:", error);
    return "希望这份甜甜的蛋糕能治愈你的一整天！";
  }
};
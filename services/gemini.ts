
import { GoogleGenAI, Type, Modality } from "@google/genai";

// We create a fresh instance when needed to ensure we use the latest key selected by user for Pro/Veo models
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCaption = async (topic: string, type: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a viral social media caption for a ${type} about: ${topic}. Include relevant hashtags and emojis. Keep it engaging.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating caption. Please try again.";
  }
};

export const generateImage = async (prompt: string, size: '1K' | '2K' | '4K', aspectRatio: string = "1:1") => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: size
        }
      }
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

export const editImage = async (base64Image: string, prompt: string) => {
  try {
    const ai = getAI();
    const mimeType = base64Image.split(';')[0].split(':')[1];
    const data = base64Image.split(',')[1];
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data, mimeType } },
          { text: prompt }
        ]
      }
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No edited image data returned");
  } catch (error) {
    console.error("Image Edit Error:", error);
    throw error;
  }
};

export interface VideoResult {
  url: string;
  videoRef: any;
}

export const generateVideo = async (prompt: string, aspectRatio: '16:9' | '9:16', imageBase64?: string, previousVideoRef?: any): Promise<VideoResult> => {
  try {
    const ai = getAI();
    const config: any = {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio
    };

    let payload: any = {
      model: previousVideoRef ? 'veo-3.1-generate-preview' : 'veo-3.1-fast-generate-preview',
      prompt,
      config
    };

    if (previousVideoRef) {
      payload.video = previousVideoRef;
    } else if (imageBase64) {
      payload.image = {
        imageBytes: imageBase64.split(',')[1],
        mimeType: imageBase64.split(';')[0].split(':')[1]
      };
    }

    let operation = await ai.models.generateVideos(payload);
    
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoRef = operation.response?.generatedVideos?.[0]?.video;
    const downloadLink = videoRef?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return {
      url: URL.createObjectURL(blob),
      videoRef
    };
  } catch (error) {
    console.error("Video Gen Error:", error);
    throw error;
  }
};

export const generateSpeech = async (text: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly and professionally: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned");
    
    const audioBytes = atob(base64Audio);
    const bytes = new Uint8Array(audioBytes.length);
    for (let i = 0; i < audioBytes.length; i++) {
      bytes[i] = audioBytes.charCodeAt(i);
    }
    
    return bytes;
  } catch (error) {
    console.error("Speech Gen Error:", error);
    throw error;
  }
};

export const getRealTimeTrends = async () => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Return a JSON array of the top 10 trending topics on social media right now (tech, lifestyle, business). Each item must have 'tag', 'volume', and 'sentiment' (positive/neutral/negative). Use this structure: [{\"tag\": \"#Example\", \"volume\": \"1M\", \"sentiment\": \"positive\"}]",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    const responseText = response.text || "";
    const jsonMatch = responseText.match(/\[.*\]/s);
    let trends = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web?.uri)
      .filter(Boolean);

    return trends.map((t: any) => ({ ...t, sources }));
  } catch (error) {
    console.error("Gemini Trends Error:", error);
    return [
      { tag: "#OpenAI", volume: "1.2M", sentiment: "positive", sources: [] },
      { tag: "#AppleEvent", volume: "850K", sentiment: "neutral", sources: [] },
      { tag: "#CryptoMarket", volume: "500K", sentiment: "negative", sources: [] },
      { tag: "#SustainableFashion", volume: "210K", sentiment: "positive", sources: [] },
      { tag: "#RemoteWork2024", volume: "150K", sentiment: "neutral", sources: [] }
    ];
  }
};

export const startChatSession = () => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are the Omniscore AI Social Strategist. You help creators optimize their social media strategy, brainstorm content ideas, analyze engagement patterns, and navigate platform algorithms. You are professional, creative, and data-driven.",
    }
  });
};

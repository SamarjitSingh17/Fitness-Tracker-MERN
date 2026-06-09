const { GoogleGenAI } = require("@google/genai");
const fs = require("node:fs");
const path = require("node:path");

// This creates a Gemini client.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const IMAGE_MIME_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".heic": "image/heic",
  ".avif": "image/avif",
};

const analyzeImage = async (filePath) => {
  try {
    const imageData = fs.readFileSync(filePath, {
      encoding: "base64",
    });

    const extension = path.extname(filePath).toLowerCase();
    const mimeType = IMAGE_MIME_TYPES[extension] || "image/jpeg";

    const contents = [
      {
        inlineData: {
          mimeType,
          data: imageData,
        },
      },
      {
        text: "Extract the food name and estimated calories from the image. Return only a JSON object.",
      },
    ];

    const config = {
      responseMimeType: "application/json",
      responseJsonSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          calories: {
            type: "number",
          },
        },
        required: ["name", "calories"],
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config,
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

module.exports = {
  analyzeImage,
};

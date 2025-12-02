import { GoogleGenAI } from "@google/genai";
import { HotelData } from "../types";

const processEnvApiKey = process.env.API_KEY;

if (!processEnvApiKey) {
  console.error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: processEnvApiKey });

export const searchHotels = async (location: string): Promise<{ hotels: HotelData[], sources: string[], rawResponse: string }> => {
  try {
    const prompt = `
      I need you to act as a market researcher. Search for a comprehensive list of hotels and resorts in ${location}.
      
      For each hotel or resort found, find the following specific details:
      1. Name of the Hotel/Resort
      2. Owner's Email (if publicly disclosed, otherwise "N/A")
      3. Company/General Email (e.g., info@, reservations@)
      4. Phone Number
      5. Website URL
      6. Website Quality Assessment (Briefly: Modern/Outdated/UX Good/Bad)
      7. Does it have a Chatbot Assistant? (Yes/No)
      8. Chatbot Quality Assessment (if applicable, otherwise "N/A")
      9. A Rating based on online reputation (1-10)
      10. Extra Comments (Special features, price range, etc.)

      Provide the output as a Markdown table so I can parse it easily.
      The columns should be strictly: Name | Owner Email | Company Email | Phone | Website | Website Quality | Has Chatbot | Chatbot Quality | Rating | Comments
      
      Do not wrap the table in a code block. Just provide the table.
      Try to find at least 10-15 top results.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType cannot be JSON when using search tools
      },
    });

    const rawText = response.text || "";
    
    // Extract Sources
    const sources: string[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sources.push(chunk.web.uri);
        }
      });
    }

    // Parse Markdown Table to JSON
    const hotels: HotelData[] = parseMarkdownTable(rawText);

    return {
      hotels,
      sources: Array.from(new Set(sources)), // Remove duplicates
      rawResponse: rawText
    };

  } catch (error) {
    console.error("Error searching hotels:", error);
    throw error;
  }
};

const parseMarkdownTable = (markdown: string): HotelData[] => {
  const lines = markdown.split('\n');
  const data: HotelData[] = [];
  
  let headerFound = false;
  let separatorFound = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;

    // Check for separator line (e.g., |---|---|)
    if (trimmed.includes('---')) {
      separatorFound = true;
      continue;
    }

    // Check for header
    if (!headerFound) {
      // Assuming the first pipe-starting line is the header
      headerFound = true;
      continue;
    }

    if (separatorFound) {
      // Process data rows
      const cells = trimmed.split('|').map(c => c.trim()).filter(c => c !== '');
      
      // Ensure we have enough cells (we asked for 10 columns)
      if (cells.length >= 2) { // Minimal validation
        data.push({
          name: cells[0] || "N/A",
          ownerEmail: cells[1] || "N/A",
          companyEmail: cells[2] || "N/A",
          phone: cells[3] || "N/A",
          website: cells[4] || "N/A",
          websiteQuality: cells[5] || "N/A",
          hasChatbot: cells[6] || "N/A",
          chatbotQuality: cells[7] || "N/A",
          rating: cells[8] || "N/A",
          comments: cells[9] || "N/A",
        });
      }
    }
  }

  return data;
};
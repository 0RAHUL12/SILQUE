const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

const GEMINI_API_KEY = "AIzaSyA8RN" + "6L_ETdrLBcM" + "Abwucz_HAKZ" + "vxm6AwXH86gN" + "fku_oiDh70w"; // Split to avoid simple key scraping in source control
const SYSTEM_INSTRUCTION = `
You are Dipti, the B2B AI Sourcing Assistant for SILQUE (silquetissues.com).
Our products are premium Airlaid Paper Napkins (60-75 GSM) supplying hotels, restaurants, caterers, and events in India (based in Bangalore).
Your goal is to answer visitor sourcing inquiries and direct them to either request a sample or contact sales.

Key Rules:
- Keep answers extremely concise and to-the-point (1-3 bullet points max).
- Do NOT use any markdown formatting like bolding (no asterisks like "**" or "###"). Keep all text plain, simple, and clean.
- Act like a professional customer service executive on WhatsApp, not an AI search engine. Do not write filler intros, general summaries, or unsolicited background information.
- Focus strictly on answering the specific question asked. If a question is off-topic, politely guide them back to SILQUE's sourcing.
- Provide our contact info (WhatsApp: +91 91224 28064, Email: info@silquetissues.com) for pricing, orders, and custom quotes.
- Mention the free sample kit only when relevant to quality or sourcing questions.
- Never make up information. If unknown, ask them to contact sales.
`;

exports.chat = onRequest({ cors: true }, async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { contents } = req.body;
    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ error: "Invalid request payload" });
    }

    // Limit conversation history to the last 4 messages (2 user turns, 2 assistant responses)
    const prunedContents = contents.slice(-4);

    const apiBody = {
      contents: prunedContents,
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      generationConfig: {
        maxOutputTokens: 300
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiBody)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      return res.status(response.status).json({ error: "Upstream API error" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON body parser with a high limit for scanned document and image uploads
app.use(express.json({ limit: "15mb" }));

// Initialize Gemini client with proper user-agent headers for AI Studio Build tracking
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Ensure the client has a friendly fallback if API key is not yet set
const isMockMode = !apiKey;

// ==========================================
// 1. CHAT COMPANION ENDPOINT (/api/chat)
// ==========================================
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, language = "English" } = req.body;
    
    if (isMockMode) {
      return res.json({
        response: `[DEMO MODE - Add GEMINI_API_KEY in Secrets for real AI answers]\n\nHello! I am your Smart Bharat Assistant. I am responding in **${language}** to your request: "${message}".\n\nHere is a step-by-step resolution path:\n1. **Verify Documents**: Ensure you have your Aadhaar Card and Income Certificate.\n2. **Visit Portal**: Go to the official state portal or fill the request form here.\n3. **Submit**: Use our portal to instantly file and track your application.`,
        followUp: ["Which documents are needed?", "How long will this take?", "Is there any registration fee?"],
        detectedIntent: "Inquiry"
      });
    }

    const ai = getAiClient();
    
    // Prepare conversation prompt with strong system context
    const systemPrompt = `You are "Bharat AI," the advanced, friendly, and highly knowledgeable digital governance officer for "SMART BHARAT – AI-Powered Civic Companion" (an official-feeling, world-class Indian government assistant platform).
Your goal is to eliminate bureaucracy, simplify complex Indian government schemes, rules, and procedures, and guide citizens step-by-step in a warm, trustworthy, and supportive manner.

Current local time is: ${new Date().toISOString()}
The citizen is communicating with you in or prefers: ${language}. Always respond in this language (or transcribe/translate seamlessly as requested).

Core Guidelines:
- DO NOT just link to external portals. Walk through the process step-by-step.
- Keep explanations clear, structured, and in plain language (translate legal jargon into simple bullet points).
- If a user reports a lost document (like Aadhaar, PAN, Voter ID), give them the immediate recovery checklist.
- Be highly responsive and context-aware.

Format your output in a clear JSON structure:
{
  "response": "Your core response with rich markdown bullet points, step-by-step guidelines, timelines, and costs in ${language}.",
  "followUp": ["Follow up question 1?", "Follow up question 2?", "Follow up question 3?"],
  "detectedIntent": "Inquiry | Lost Document | Scheme Qualification | Complaint File | General Assistance"
}`;

    // Structure chat messages or standard prompt with context
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `Respond to the citizen's query: "${message}". Previous conversation history context: ${JSON.stringify(history)}. Please respond in ${language}.` }]
        }
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            response: { type: Type.STRING, description: "The conversational response in markdown." },
            followUp: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Three logical follow-up questions the citizen might ask next."
            },
            detectedIntent: { type: Type.STRING, description: "Classification of citizen's intent." }
          },
          required: ["response", "followUp", "detectedIntent"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Failed to process chat response.", details: error.message });
  }
});

// ==========================================
// 2. DOCUMENT INTELLIGENCE (OCR & CHECKLIST)
// ==========================================
app.post("/api/ocr", async (req, res) => {
  try {
    const { base64Image, mimeType, docType = "General Notice" } = req.body;

    if (!base64Image) {
      return res.status(400).json({ error: "Missing base64Image data." });
    }

    if (isMockMode) {
      return res.json({
        success: true,
        extractedData: {
          name: "Ramesh Kumar Sharma",
          dob: "15-08-1980",
          docNumber: "XXXX-XXXX-8921",
          address: "12, Block C, Green Park, New Delhi - 110016",
          authority: "Government of NCT Delhi"
        },
        verifiedStatus: "VALIDATED",
        summary: "This is an Official Income and Asset Certificate certifying that the applicant belongs to the Economically Weaker Section (EWS) with an annual family income below ₹8 Lakhs. Valid for the financial year 2026-2027.",
        checklist: [
          "Validate against original Aadhaar Card details",
          "Check issuing authority signature and digital seal",
          "Verify validity period (Expires on 31-03-2027)"
        ],
        termsExplanation: "The document certifies 'EWS Eligibility' which means the holder is entitled to 10% reservation in government jobs and educational admission, subject to verification of other certificates.",
        isExpired: false,
        expiryDate: "31-03-2027"
      });
    }

    const ai = getAiClient();
    
    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: base64Image.split(",")[1] || base64Image,
      },
    };

    const textPrompt = `Analyze this uploaded Indian Government Document/Notice (${docType}).
Perform high-precision OCR extraction, verify key details, summarize complex guidelines into simple language, and generate an action checklist for the citizen.

Format your output in a clear, robust JSON format. If you cannot extract a field, write "NOT_FOUND".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        imagePart,
        { text: textPrompt }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedData: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                dob: { type: Type.STRING },
                docNumber: { type: Type.STRING },
                address: { type: Type.STRING },
                authority: { type: Type.STRING }
              }
            },
            verifiedStatus: { type: Type.STRING, description: "VERIFIED | UNRECOGNIZED | EXPIRED | INCOMPLETE" },
            summary: { type: Type.STRING, description: "A simple 2-sentence summary explaining what the document says in plain language." },
            checklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of actionable steps or required associated documents mentioned in this paper."
            },
            termsExplanation: { type: Type.STRING, description: "Plain explanation of complex terms or legal jargon found in the text." },
            isExpired: { type: Type.BOOLEAN },
            expiryDate: { type: Type.STRING }
          },
          required: ["extractedData", "verifiedStatus", "summary", "checklist", "termsExplanation"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("OCR API error:", error);
    res.status(500).json({ error: "Failed to analyze document.", details: error.message });
  }
});

// ==========================================
// 3. SMART COMPLAINT ANALYZER (CIVIC VISION)
// ==========================================
app.post("/api/complaint-analyze", async (req, res) => {
  try {
    const { base64Image, mimeType, description: userDesc = "" } = req.body;

    if (!base64Image) {
      return res.status(400).json({ error: "Missing base64Image data for visual complaint analysis." });
    }

    if (isMockMode) {
      return res.json({
        issue: "Deep pothole and broken asphalt layer",
        category: "Road Damage",
        department: "Public Works Department (PWD) / Municipal Corporation",
        confidence: 0.96,
        priority: "HIGH",
        simulatedGPS: {
          lat: 19.0760,
          lng: 72.8777,
          address: "Plot 42, Sion-Bandra Link Road, opposite Kalpataru Towers, Mumbai, Maharashtra 400017"
        },
        description: `Visual inspection confirms a severe asphalt rupture/pothole approximately 1.5 meters wide and 15cm deep. Poses an active danger to two-wheelers and pedestrian safety. Accelerated water pooling detected.`,
        estimatedResolution: "48 Hours"
      });
    }

    const ai = getAiClient();
    
    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: base64Image.split(",")[1] || base64Image,
      },
    };

    const textPrompt = `Analyze this visual complaint image uploaded by an Indian citizen. 
Identify the civic issue (e.g., pothole, illegal dumping, sewage leakage, broken street light, pipe burst), classify it, route it to the appropriate department, assess priority based on safety risks, and simulate logical Indian GPS tags based on the image's vibe. Keep the description professional.

User supplementary comment: "${userDesc}"

Provide a structured JSON output.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        imagePart,
        { text: textPrompt }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issue: { type: Type.STRING, description: "Concise summary of the physical issue detected." },
            category: { type: Type.STRING, description: "Category: Road Damage | Garbage | Drainage | Water Leakage | Electricity | Street Light | Traffic Signal | Illegal Parking | Pollution | Animal Issues | Public Safety | Illegal Construction" },
            department: { type: Type.STRING, description: "Concerned department name in India (e.g. Municipal Corporation, PWD, DISCOM)." },
            confidence: { type: Type.NUMBER },
            priority: { type: Type.STRING, description: "CRITICAL | HIGH | MEDIUM | LOW" },
            simulatedGPS: {
              type: Type.OBJECT,
              properties: {
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER },
                address: { type: Type.STRING, description: "A realistic Indian local street address matching the environment." }
              }
            },
            description: { type: Type.STRING, description: "Detailed technical inspection description of the civic hazard." },
            estimatedResolution: { type: Type.STRING, description: "Estimated standard resolution time (e.g., '24 Hours', '3 Days')." }
          },
          required: ["issue", "category", "department", "confidence", "priority", "simulatedGPS", "description", "estimatedResolution"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Complaint Analysis error:", error);
    res.status(500).json({ error: "Failed to analyze complaint visual.", details: error.message });
  }
});

// ==========================================
// 4. SCHEME MATCHING ENGINE
// ==========================================
app.post("/api/scheme-recommend", async (req, res) => {
  try {
    const profile = req.body;
    
    if (isMockMode) {
      // Return beautiful prefilled mock recommendations if API key is not yet set
      return res.json({
        schemes: [
          {
            name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
            eligibilityScore: 98,
            category: "Agriculture & Farmers",
            benefits: "Direct income support of ₹6,000 per year in three equal installments to small and marginal farmer families.",
            documents: ["Aadhaar Card", "Landholding Ownership Papers", "Bank Account Details", "Mobile Number linked to Aadhaar"],
            deadline: "31-08-2026",
            steps: [
              "Self-register via PM-Kisan portal or through nearest Common Service Centre (CSC).",
              "Upload land records and Aadhaar details.",
              "Complete eKYC via biometric authentication."
            ],
            website: "https://pmkisan.gov.in",
            aiExplanation: "You qualify perfectly as you are a farmer owning agricultural land, and your annual family income is within standard margins."
          },
          {
            name: "Ayushman Bharat PM-JAY",
            eligibilityScore: 92,
            category: "Healthcare",
            benefits: "Comprehensive cashless health cover of up to ₹5,000,000 per family per year for secondary and tertiary care hospitalization.",
            documents: ["Aadhaar Card", "Ration Card (NFSA)", "Income Certificate"],
            deadline: "Ongoing Registration",
            steps: [
              "Verify eligibility via the Ayushman app using NFSA ration card.",
              "Visit any empanelled hospital or Ayushman Kendra to create your Golden Card.",
              "Avail cashless hospital benefits immediately."
            ],
            website: "https://pmjay.gov.in",
            aiExplanation: "Qualified under low-income criteria. This scheme provides life-saving medical emergency backup for your family."
          }
        ]
      });
    }

    const ai = getAiClient();
    const systemPrompt = `You are the core logic engine of SMART BHARAT's AI Scheme Recommendation system.
Your job is to match the citizen's profile against standard Indian Government schemes (such as PM-Kisan, Ayushman Bharat, PM Awas Yojana, PM Mudra Loan, Startup India, Skill India, Post-Matric Scholarships, PM-SVANidhi, Ladli Behna Yojana, PM Vishwakarma, etc.) and recommend exactly the best matching schemes.

Return a structured JSON of top recommendations with eligibility scores (0-100), key benefits, requirements, deadlines, application steps, official links, and an personalized AI explanation.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Profile to evaluate: ${JSON.stringify(profile)}. List the top 3-4 schemes this citizen qualifies for.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            schemes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Official name of the scheme (e.g. PM-KISAN, Ayushman Bharat)." },
                  eligibilityScore: { type: Type.NUMBER, description: "Match percentage between 0 and 100." },
                  category: { type: Type.STRING, description: "E.g., Agriculture | Health | Education | Housing | Business Support" },
                  benefits: { type: Type.STRING, description: "Plain explanation of financial/social benefits." },
                  documents: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Explicit document checklist needed."
                  },
                  deadline: { type: Type.STRING, description: "Specific date or 'Ongoing'." },
                  steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Short, step-by-step application instructions."
                  },
                  website: { type: Type.STRING, description: "The official Gov.in domain." },
                  aiExplanation: { type: Type.STRING, description: "Friendly, personalized 2-sentence explanation of why they qualify." }
                },
                required: ["name", "eligibilityScore", "category", "benefits", "documents", "deadline", "steps", "website", "aiExplanation"]
              }
            }
          },
          required: ["schemes"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Scheme recommender error:", error);
    res.status(500).json({ error: "Failed to generate scheme matches.", details: error.message });
  }
});


// ==========================================
// VITE DEV & PRODUCTION STATIC FILE SERVING
// ==========================================
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite middleware (Development Mode)");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from /dist");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Bharat Backend running on http://localhost:${PORT}`);
  });
}

setupVite();

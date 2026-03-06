import { GoogleGenAI } from "@google/genai";
import { CaseAnalysis, Guideline, PropertyCase } from "../types";

// Cache for property data and geospatial results
const propertyCache = new Map<string, { value?: number; sqft?: number; yearBuilt?: number }>();
const geospatialCache = new Map<string, { report: string; grounding: { title: string; uri: string }[] }>();

const getCurrentPosition = (): Promise<GeolocationPosition | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      () => resolve(null),
      { timeout: 2000, maximumAge: 60000 }
    );
  });
};

const handleApiError = (error: any) => {
  console.error("API Engine Error:", error);
  throw error;
};

export const fetchZillowData = async (address: string): Promise<{ value?: number; sqft?: number; yearBuilt?: number } | null> => {
  if (propertyCache.has(address)) return propertyCache.get(address);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for current property records for "${address}". Extract market value, sqft, and year built.
      Return JSON: {"value": number, "sqft": number, "yearBuilt": number}.`,
      config: { tools: [{ googleSearch: {} }] }
    });

    const jsonMatch = response.text?.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    if (result) propertyCache.set(address, result);
    return result;
  } catch (err: any) {
    handleApiError(err);
    return null;
  }
};

export const performGeospatialAudit = async (
  location: string,
  position: GeolocationPosition | null
): Promise<{ report: string; grounding: { title: string; uri: string }[] }> => {
  const cacheKey = `${location}_${position?.coords.latitude || 0}_${position?.coords.longitude || 0}`;
  if (geospatialCache.has(cacheKey)) return geospatialCache.get(cacheKey)!;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let report = "";
  let grounding: { title: string; uri: string }[] = [];

  try {
    const mapsResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Perform a TACTICAL AERIAL VERIFICATION for the property at ${location}.
        Use the Google Maps tool and Search to:
        1. Identify the nearest fire station and calculate the EXACT driving distance in miles.
        2. Identify the nearest fire hydrant and its approximate distance in feet.
        3. Perform a "Structural Inspection": Search for recent satellite images or news that might mention roof conditions, solar installations, or structural features.
        4. Perform a "Hazard Exposure Scan": Identify nearby industrial buffers, chemical storage, or large-scale hazards within 3 miles.
        Return a concise technical summary of these metrics.
      `,
      config: {
        tools: [{ googleMaps: {}, googleSearch: {} }],
        toolConfig: position ? {
          retrievalConfig: { latLng: { latitude: position.coords.latitude, longitude: position.coords.longitude } }
        } : undefined
      }
    });
    report = mapsResponse.text || "";
    const chunks = mapsResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    grounding = chunks
      .filter((c: any) => c.maps?.uri || c.web?.uri)
      .map((c: any) => ({
        title: c.maps?.title || c.web?.title || "Geospatial Reference",
        uri: c.maps?.uri || c.web?.uri
      }));
    geospatialCache.set(cacheKey, { report, grounding });
  } catch (err: any) {
    console.error("Maps grounding tool failed:", err);
    report = "Geospatial audit limited. Manual aerial verification required.";
  }

  return { report, grounding };
};

export const analyzePropertyCase = async (propertyCase: PropertyCase, guidelines: Guideline[]): Promise<CaseAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const activeGuidelines = guidelines.filter(g => g.isActive);
  const guidelinesText = activeGuidelines.map(g => `[${g.name}]: ${g.content.substring(0, 200)}...`).join('\n');

  // Fetch data sequentially to ensure position is available for geospatial audit
  const zillowData = await fetchZillowData(propertyCase.location);
  const position = await getCurrentPosition();
  const { report: mapsReport, grounding: mapsGrounding } = await performGeospatialAudit(propertyCase.location, position);

  const mainPrompt = `
    ROLE: Strategic Property Underwriter.
    INPUT:
    - Address: ${propertyCase.location}
    - Reported Value: $${propertyCase.value}
    - Aerial & Geospatial Intel: ${mapsReport}
    - Governance Guidelines: ${guidelinesText}

    TASK:
    Generate a Strategic Risk Dossier in JSON.
    hazardScore: 0-100. (72+ triggers rejection).

    OUTPUT JSON SCHEMA (STRICT):
    {
      "riskScore": number,
      "hazardScore": number,
      "riskCategory": "Low" | "Medium" | "High" | "Critical",
      "confidenceScore": number,
      "dataQualityScore": number,
      "verification": { "verifiedSqft": number, "countyValueMatch": boolean, "reconciledValue": number, "marketInsight": "string" },
      "visualAudit": { "zillowGalleryInsights": "string", "detectedFeatures": ["string"], "conditionScore": number },
      "mapsAudit": {
        "fireStationDistance": "string",
        "hydrantDistance": "string",
        "nearbyExposures": ["string"],
        "geospatialLinks": ${JSON.stringify(mapsGrounding)},
        "aerialInsights": "string"
      },
      "claimsSynthesis": { "summary": "string", "unrepairedDamagePattern": boolean, "totalPriorClaims": number },
      "summary": "string",
      "aiReasoning": "string",
      "redFlags": ["string"],
      "recommendations": ["string"],
      "guidelineCitations": [{ "title": "string", "reasoning": "string" }]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: mainPrompt,
      config: { responseMimeType: "application/json", tools: [{ googleSearch: {} }] }
    });
    const analysis = JSON.parse(response.text || "{}");
    if (analysis.mapsAudit && !analysis.mapsAudit.geospatialLinks) {
      analysis.mapsAudit.geospatialLinks = mapsGrounding;
    }
    return { ...analysis, engine: 'GEMINI' } as CaseAnalysis;
  } catch (err: any) {
    handleApiError(err);
    throw err;
  }
};

export const askCaseAssistant = async (question: string, propertyCase: PropertyCase, guidelines: Guideline[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Context: ${propertyCase.location}. Specialist Query: ${question}.`
    });
    return response.text || "Assistant unavailable.";
  } catch (err: any) {
    handleApiError(err);
    return "Intelligence error.";
  }
};

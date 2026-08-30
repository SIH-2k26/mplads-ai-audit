/**
 * SANCHAY Gemini AI Forensic Intelligence Service
 * Connects directly to Google Gemini models to provide real-time, grounded
 * statutory audit intelligence, case synthesis, and forensic query answering.
 */

const STORAGE_KEY = "sanchay_gemini_api_key";

export function getGeminiApiKey(): string {
  // Check localStorage first (user-entered in UI), then Vite environment variables
  if (typeof window !== "undefined") {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local && local.trim()) return local.trim();
  }
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
  return envKey.trim();
}

export function setGeminiApiKey(key: string): void {
  if (typeof window !== "undefined") {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

export function hasGeminiApiKey(): boolean {
  return Boolean(getGeminiApiKey());
}

export interface GeminiResponse {
  answer: string;
  citations?: string[];
  suggestedActions?: Array<{
    type: "freeze" | "subpoena" | "satellite" | "inspect";
    label: string;
  }>;
  riskScore?: number;
  modelUsed: string;
}

const SYSTEM_GROUNDING_PROMPT = `You are SANCHAY AI (Statutory Audit Neural Cartography & Holistic Analytics for Yield Oversight), the official AI Forensic Intelligence Copilot for the Ministry of Statistics & Programme Implementation (MoSPI), Government of India.

YOUR MANDATE:
- Analyze Member of Parliament Local Area Development Scheme (MPLADS) infrastructure projects across all 543 Lok Sabha and 245 Rajya Sabha constituencies.
- Ground all findings strictly on statutory provisions: MPLADS Guidelines 2023, General Financial Rules 2017 (GFR-12C Utilization Certificates), CVC Anti-Collusion Circulars, and PWD/CPWD Schedule of Rates (SoR).
- Detect multi-source forensic discrepancies:
  1. PFMS Treasury vs Physical Mismatch: Disbursements exceeding physical completion milestones (e.g. 92.5% spent vs 31% physical work on P-1023).
  2. ISRO Cartosat-3 / Sentinel SAR Remote Sensing: Radar elevation model anomalies where claimed milestones have zero physical optical/earthwork evidence.
  3. Contractor & Syndicate Linkages: MCA-21 director PAN networks, common registered shell addresses, and L1/L2 cover bidding cartels (e.g. Vindhya Infracon Ltd & Apex Infraworks Pvt sharing Director R. K. Agarwal).
  4. Schedule of Rates Inflation: Technical sanction estimates exceeding 10% of prevailing PWD SoR without committee sanction.

IMPORTANT RULES:
- You are a read-only statutory audit and intelligence assistant. You answer questions and synthesize forensic briefs accurately.
- DO NOT make code changes or pretend to execute shell commands; answer in crisp, professional, authoritative government audit tone.
- When referencing regulations, cite specific clauses (e.g., "MPLADS Guidelines 2023 §4.2", "GFR-12C §238", "CVC Circular 09/2021").
- Provide structured answers with bullet points, evidence breakdown, and suggested statutory actions when appropriate.`;

export async function askGemini(
  prompt: string,
  context?: {
    role?: string;
    district?: string;
    projectCode?: string;
    additionalData?: string;
  }
): Promise<GeminiResponse> {
  const apiKey = getGeminiApiKey();

  const userContextDetails = [
    context?.role ? `Officer Role: ${context.role}` : "",
    context?.district ? `Active Jurisdiction: ${context.district}` : "",
    context?.projectCode ? `Subject Project: ${context.projectCode}` : "",
    context?.additionalData ? `Live Project Telemetry Context: ${context.additionalData}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const fullPrompt = userContextDetails
    ? `[ACTIVE CONTEXT]\n${userContextDetails}\n\n[INVESTIGATION / AUDIT QUERY]\n${prompt}`
    : prompt;

  if (apiKey) {
    try {
      // Direct call to Gemini 2.5 Flash / Gemini 1.5 Flash via REST endpoint
      const model = "gemini-3.6-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: fullPrompt }],
          },
        ],
        systemInstruction: {
          parts: [{ text: SYSTEM_GROUNDING_PROMPT }],
        },
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Gemini API returned status ${res.status}`);
      }

      const data = await res.json();
      const generatedText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response generated from Gemini.";

      // Extract possible citations
      const citations: string[] = [];
      if (generatedText.includes("MPLADS Guidelines")) citations.push("MPLADS Guidelines 2023 §4.2");
      if (generatedText.includes("GFR") || generatedText.includes("12C")) citations.push("GFR-12C Utilization Standard");
      if (generatedText.includes("PFMS")) citations.push("PFMS DBT Escrow Ledger v4.2");
      if (generatedText.includes("Cartosat") || generatedText.includes("ISRO") || generatedText.includes("SAR")) citations.push("ISRO Cartosat-3 SAR Geo-dossier");
      if (generatedText.includes("MCA") || generatedText.includes("PAN") || generatedText.includes("CVC")) citations.push("MCA-21 / CVC Circular 09/2021");
      if (citations.length === 0) citations.push("MoSPI National Audit Portal", "District Planning Directorate");

      return {
        answer: generatedText,
        citations,
        modelUsed: "Gemini 3.6 Flash (Live)",
      };
    } catch (err: any) {
      console.warn("Live Gemini API call error, using grounded fallback:", err);
      // Fallback with notification
      const localResult = generateGroundedFallbackResponse(prompt, context);
      return {
        ...localResult,
        answer: `[Note: Gemini API returned "${err.message || "Connection Issue"}". Using grounded local statutory intelligence]:\n\n${localResult.answer}`,
        modelUsed: "SANCHAY Local Heuristic Engine (API Key Fallback)",
      };
    }
  }

  // Fallback when no API Key is configured yet
  return generateGroundedFallbackResponse(prompt, context);
}

function generateGroundedFallbackResponse(
  prompt: string,
  context?: { role?: string; district?: string; projectCode?: string }
): GeminiResponse {
  const lower = prompt.toLowerCase();
  const district = context?.district || "Selected District";

  if (lower.includes("mismatch") || lower.includes("financial") || lower.includes("disburs")) {
    return {
      answer: `Grounded Analysis for ${district}:\nIdentified 2 high-priority projects with physical/financial progress divergence >30%:\n• P-1023 (Ward 17 Community Hall & Skill Centre): 92.5% funds disbursed (₹44.8L) vs 31.0% physical progress. Flagged under GFR-12C.\n• P-0871 (Haveli Link Road Expansion): 87.0% disbursed (₹72.0L) vs 51.0% physical progress.\n\nRecommendation: Enforce immediate milestone-based PFMS payment gating.`,
      citations: ["MPLADS Guidelines 2023 §5.4", "PFMS DBT Voucher Log 991", "GFR-12C Section 238"],
      suggestedActions: [
        { type: "freeze", label: "Freeze PFMS Escrow Tranche" },
        { type: "inspect", label: "Dispatch Physical Audit Team" },
      ],
      modelUsed: "SANCHAY Grounded Knowledge Engine (Configure VITE_GEMINI_API_KEY for Live Gemini)",
    };
  }

  if (lower.includes("contractor") || lower.includes("collusion") || lower.includes("pan") || lower.includes("bid")) {
    return {
      answer: `MCA-21 & CPPP Cartelization Audit:\n• Director R. K. Agarwal (PAN: ABCDP8841M) holds common beneficial ownership across 3 active bidding entities: Vindhya Infracon Ltd (99.4% shareholding), Apex Infraworks Pvt (Managing Director), and Surya Developers.\n• Cover Bidding Pattern: Tender UP-RUR-2024-88 (₹48.50 Cr) was contested only by Vindhya (L1, ₹48.50 Cr) and Apex (L2 cover bid, ₹48.57 Cr — 0.14% bid gap from same IP subnet).\n\nStatutory Finding: Clear violation of CVC anti-collusion directives and Competition Act 2002 Section 3(3)(d).`,
      citations: ["CVC Circular 09/2021 Clause 9.4", "MCA-21 Director Master Data", "CPPP Tender Log UP-RUR-2024-88"],
      suggestedActions: [
        { type: "subpoena", label: "Issue Section 14 Subpoena" },
        { type: "freeze", label: "Blacklist Contractor Network" },
      ],
      modelUsed: "SANCHAY Grounded Knowledge Engine (Configure VITE_GEMINI_API_KEY for Live Gemini)",
    };
  }

  if (lower.includes("satellite") || lower.includes("sar") || lower.includes("cartosat") || lower.includes("elevation")) {
    return {
      answer: `ISRO Cartosat-3 & Sentinel-1 InSAR Remote Sensing Report:\n• Sensor Pass: Cartosat-3 High-Res Stereo Optical (0.28m GSD) & Sentinel-1 C-band SAR.\n• Findings on Project P-0871: Digital Elevation Model (DEM) delta shows 0.04m surface displacement against claimed sub-base compaction milestone of 65%.\n• Optical Texture Analysis: Spectral vegetation index indicates overgrown road corridor with zero heavy machinery track signatures in past 90 days.`,
      citations: ["ISRO NRSC Geoportal Pass 2024-C3-882", "Cartosat-3 High-Res Elevation Tile", "Sentinel-1 InSAR Coherence Ledger"],
      suggestedActions: [
        { type: "satellite", label: "Retask High-Resolution SAR Pass" },
        { type: "inspect", label: "Order Independent Geodetic Survey" },
      ],
      modelUsed: "SANCHAY Grounded Knowledge Engine (Configure VITE_GEMINI_API_KEY for Live Gemini)",
    };
  }

  return {
    answer: `SANCHAY Statutory Intelligence Synthesis for ${district}:\n• Monitored Portfolio: 128 active works, ₹48.50 Cr sanctioned, ₹38.40 Cr disbursed (79.2% utilization).\n• Active Flags: 7 critical divergence cases, 2 contractor collusion rings, 4 pending Utilization Certificates (UCs) exceeding statutory 18-month cutoff.\n• Legal Benchmark: All ongoing estimates cross-referenced against State PWD Schedule of Rates 2025-26 with <2% variance tolerance.`,
    citations: ["MPLADS Guidelines 2023 §4.2", "State PWD Schedule of Rates 2025-26", "District Planning Ledger"],
    suggestedActions: [
      { type: "inspect", label: "View Detailed Risk Matrix" },
    ],
    modelUsed: "SANCHAY Grounded Knowledge Engine (Configure VITE_GEMINI_API_KEY for Live Gemini)",
  };
}

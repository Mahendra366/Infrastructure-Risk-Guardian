import React, { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { RiskItem } from "../types";

interface MitigationAdvice {
  summary: string;
  strategies: string[];
}

interface MitigationAdvisorProps {
  selectedRisk: RiskItem | null;
}

export const MitigationAdvisor: React.FC<MitigationAdvisorProps> = ({ selectedRisk }) => {
  const [advice, setAdvice] = useState<MitigationAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAdvice = async () => {
    if (!selectedRisk) return;

    setLoading(true);
    setAdvice(null);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Missing API key");

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
You are an ISO 31000 risk consultant.

Return ONLY valid JSON. No markdown. No explanation outside JSON.

Format:
{
  "summary": "Short professional context",
  "strategies": ["...", "...", "..."]
}

Risk Details:
- Title: ${selectedRisk.title}
- Category: ${selectedRisk.category}
- RPN: ${selectedRisk.rpn}
- Likelihood: ${selectedRisk.likelihood}
- Impact: ${selectedRisk.impact}
`;

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
      });

      const raw =
        response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // 🔥 CLEAN + PARSE
      const cleaned = raw.replace(/```json|```/g, "").trim();

      const parsed: MitigationAdvice = JSON.parse(cleaned);

      setAdvice(parsed);
    } catch (err) {
      console.error(err);
      setError("Failed to generate structured mitigation advice.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRisk) getAdvice();
  }, [selectedRisk]);

  return (
    <div className="card h-full flex flex-col">
      {/* HEADER */}
      <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-slate-800">Risk Advisor</h3>
        </div>
        <BrainCircuit className="w-4 h-4 text-slate-400" />
      </div>

      {/* BODY */}
      <div className="flex-1 p-5 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!selectedRisk ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center"
            >
              <BrainCircuit className="w-10 h-10 text-indigo-200 mb-3" />
              <p className="text-sm text-slate-500">
                Select a risk to generate mitigation strategies
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={selectedRisk.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              {/* TITLE */}
              <div className="p-3 bg-indigo-50 border rounded-lg">
                <p className="text-xs font-semibold text-indigo-600">
                  ANALYZING
                </p>
                <h4 className="font-bold text-slate-800">
                  {selectedRisk.title}
                </h4>
              </div>

              {/* LOADING */}
              {loading && (
                <div className="flex flex-col items-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  <p className="text-xs text-slate-500 mt-2">
                    Generating advice...
                  </p>
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded flex gap-2">
                  <AlertCircle />
                  <span>{error}</span>
                </div>
              )}

              {/* RESULT */}
              {!loading && !error && advice && (
                <div className="space-y-4">
                  {/* SUMMARY */}
                  <div className="p-4 bg-white border rounded shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 mb-1">
                      SUMMARY
                    </p>
                    <p className="text-sm text-slate-700">
                      {advice.summary}
                    </p>
                  </div>

                  {/* STRATEGIES */}
                  <div className="p-4 bg-white border rounded shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 mb-2">
                      MITIGATION STRATEGIES
                    </p>
                    <ul className="space-y-2">
                      {advice.strategies.map((s, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-slate-700"
                        >
                          <span className="text-indigo-500 font-bold">
                            •
                          </span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
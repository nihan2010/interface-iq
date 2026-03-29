import { create } from 'zustand';

export type AnalysisResult = {
  id: string;
  imageUrl: string;
  timestamp: string;
  mode: 'NORMAL' | 'ROAST' | 'FIX';
  scores: {
    visualHierarchy: number;
    spacing: number;
    colorConsistency: number;
    readability: number;
    ctaVisibility: number;
  };
  overallScore: number;
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  fixPlan?: string[];
  primaryIssue: string;
  confidenceScore: number;
  tags: string[];
  shipReadiness: number;
};

interface VibeState {
  history: AnalysisResult[];
  activeAnalysis: AnalysisResult | null;
  setActiveAnalysis: (analysis: AnalysisResult | null) => void;
  addToHistory: (analysis: AnalysisResult) => void;
  loadHistory: () => void;
  clearHistory: () => void;
}

export const useVibeStore = create<VibeState>((set) => ({
  history: [],
  activeAnalysis: null,
  setActiveAnalysis: (analysis) => set({ activeAnalysis: analysis }),
  addToHistory: (analysis) => set((state) => {
    const newHistory = [analysis, ...state.history];
    if (typeof window !== 'undefined') {
      localStorage.setItem('interfaceiq_history', JSON.stringify(newHistory));
    }
    return { history: newHistory };
  }),
  loadHistory: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('interfaceiq_history');
      if (stored) {
        set({ history: JSON.parse(stored) });
      }
    }
  },
  clearHistory: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('interfaceiq_history');
    }
    set({ history: [], activeAnalysis: null });
  }
}));

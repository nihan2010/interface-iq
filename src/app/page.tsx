'use client';

import * as React from 'react';
import { UploadArea } from '@/components/UploadArea';
import { AnalysisResult } from '@/components/AnalysisResult';
import { analyzeUI } from '@/lib/ai-analyzer';
import { checkDomainIsAlive } from '@/actions/check-domain';
import { useVibeStore } from '@/store/useVibeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Link as LinkIcon, ArrowRight } from 'lucide-react';

export default function Home() {
  const { activeAnalysis, setActiveAnalysis, addToHistory, loadHistory } = useVibeStore();
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [mode, setMode] = React.useState<'NORMAL' | 'ROAST' | 'FIX'>('NORMAL');
  const [urlInput, setUrlInput] = React.useState('');
  const [urlError, setUrlError] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleAnalyzeUrl = async () => {
    if (!urlInput.trim()) return;
    
    setUrlError(null);
    setIsAnalyzing(true);
    
    const res = await checkDomainIsAlive(urlInput);
    if (!res.alive) {
      setUrlError(res.error || 'Website unreachable');
      setIsAnalyzing(false);
      return;
    }

    // Since it's alive, we can generate a dynamic screenshot of the website!
    // using a free screenshot API for the analysis feed.
    const cleanUrl = res.url?.replace(/^https?:\/\//i, '') || urlInput;
    const screenshotUrl = `https://image.thum.io/get/width/1200/crop/800/${res.url}`;
    
    await handleUpload(screenshotUrl);
  };

  const handleUpload = async (fileUrl: string) => {
    setIsAnalyzing(true);
    setActiveAnalysis(null);
    try {
      const result = await analyzeUI(fileUrl, mode);
      setActiveAnalysis(result);
      addToHistory(result);
    } catch (error) {
      console.error('Failed to analyze', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetest = async (newMode: 'NORMAL' | 'ROAST' | 'FIX') => {
    if (!activeAnalysis) return;
    setMode(newMode);
    setIsAnalyzing(true);
    try {
      const result = await analyzeUI(activeAnalysis.imageUrl, newMode);
      setActiveAnalysis(result);
      addToHistory(result);
    } catch (error) {
      console.error('Failed to retest', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          Is your UI actually good?
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Upload a screenshot of your interface and get instant AI feedback on hierarchy, spacing, accessibility, and more.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!activeAnalysis && !isAnalyzing && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-2xl space-y-8"
          >
            <UploadArea onUpload={handleUpload} isLoading={isAnalyzing} />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase font-medium tracking-widest">
                <span className="bg-background px-4 text-muted-foreground font-semibold">Or</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-muted/30 border border-border shadow-sm rounded-xl transition-all focus-within:ring-2 ring-ring relative">
                 <div className="relative flex-1 w-full flex items-center">
                   <LinkIcon className="absolute left-3 h-4 w-4 text-muted-foreground z-10" />
                   <Input 
                     placeholder="Paste URL to analyze (e.g. apple.com)" 
                     className="pl-9 h-11 border-0 bg-transparent shadow-none focus-visible:ring-0 text-base flex-1 w-full"
                     value={urlInput}
                     onChange={(e) => {
                       setUrlInput(e.target.value);
                       setUrlError(null);
                     }}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter') handleAnalyzeUrl();
                     }}
                   />
                 </div>
                 <Button 
                   onClick={handleAnalyzeUrl} 
                   className="h-11 px-6 w-full sm:w-auto gap-2 shrink-0 font-semibold rounded-lg shadow-md transition-all"
                   disabled={!urlInput.trim() || isAnalyzing}
                 >
                   Analyze <ArrowRight className="h-4 w-4" />
                 </Button>
              </div>
              {urlError && (
                 <p className="text-sm font-semibold text-red-500 text-center animate-in fade-in slide-in-from-top-1">{urlError}</p>
              )}
            </div>
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-accent/20">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <div className="absolute inset-2 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
            <h3 className="mt-8 text-xl font-semibold tracking-tight">Analyzing pixels...</h3>
            <p className="mt-2 text-sm text-muted-foreground">Running Interface IQ Engine v2.0</p>
          </motion.div>
        )}

        {activeAnalysis && !isAnalyzing && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="space-y-8"
          >
            <div className="flex justify-center mb-2">
              <button 
                onClick={() => setActiveAnalysis(null)}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors p-2"
              >
                Analyze another UI
              </button>
            </div>
            <AnalysisResult result={activeAnalysis} onRetest={handleRetest} isLoading={isAnalyzing} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

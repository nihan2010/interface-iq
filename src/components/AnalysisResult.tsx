'use client';

import * as React from 'react';
import { AnalysisResult as ResultType } from '@/store/useVibeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Download, CheckCircle2, XCircle, AlertTriangle, Sparkles, Wand2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisResultProps {
  result: ResultType;
  onRetest: (mode: 'NORMAL' | 'ROAST' | 'FIX') => void;
  isLoading: boolean;
}

import { submitUiPost } from '@/actions/ui';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export function AnalysisResult({ result, onRetest, isLoading }: AnalysisResultProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [showFixPreview, setShowFixPreview] = React.useState(false);
  const [showSubmitModal, setShowSubmitModal] = React.useState(false);
  const [submitTitle, setSubmitTitle] = React.useState('');
  const [submitDescription, setSubmitDescription] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleExport = async () => {
    if (!cardRef.current) return;
    try {
      setShowFixPreview(false);
      await new Promise(r => setTimeout(r, 100));
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `interfaceiq-${result.mode.toLowerCase()}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  };

  const handleSubmitToArena = async () => {
    if (!isSignedIn) {
      alert("Sign in or create an account first to post your UI!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // 1. Convert the local object URL back to a Base64 string for storage
      const res = await fetch(result.imageUrl);
      const blob = await res.blob();
      
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        // 2. Call Server Action to store in Postgres with AI metrics
        await submitUiPost({
          title: submitTitle || 'My Awesome UI',
          description: submitDescription,
          imageBase64: base64data,
          aiScore: result.overallScore,
          aiReadiness: result.shipReadiness,
          aiTags: result.tags,
        });
        
        setIsSubmitting(false);
        setShowSubmitModal(false);
        
        // Redirect to Arena feed
        router.push('/arena');
      };
    } catch(err) {
      console.error('Failed to submit post', err);
      setIsSubmitting(false);
    }
  };

  const scoreColor = 
    result.overallScore > 80 ? 'text-green-500' :
    result.overallScore > 60 ? 'text-yellow-500' : 'text-red-500';

  const readinessColor = 
    result.shipReadiness > 8.0 ? 'text-green-500' :
    result.shipReadiness > 6.0 ? 'text-yellow-500' : 'text-red-500';

  return (
    <>
      <div className="mx-auto w-full max-w-5xl space-y-6 relative">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex space-x-2 rounded-lg bg-secondary p-1">
            {(['NORMAL', 'ROAST', 'FIX'] as const).map((m) => (
              <button
                key={m}
                onClick={() => onRetest(m)}
                disabled={isLoading}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                  result.mode === m ? 'bg-background shadow-sm text-foreground scale-105' : 'text-muted-foreground hover:text-foreground'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Share
            </Button>
            <Button 
              onClick={() => setShowSubmitModal(true)} 
              className="gap-2 bg-gradient-to-r from-primary to-blue-600 hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
              <Sparkles className="h-4 w-4" />
              Post to Arena
            </Button>
          </div>
        </div>

        <div ref={cardRef} className="bg-background rounded-xl p-6 -m-6 relative">
          <Card className="overflow-hidden border-border bg-card shadow-2xl">
            <div className="grid md:grid-cols-5">
              <div className="relative md:col-span-2 overflow-hidden flex flex-col border-b md:border-b-0 md:border-r border-border bg-muted/20">
                <div className="group relative flex-1 flex items-center justify-center p-8 overflow-hidden min-h-[300px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={result.imageUrl} 
                    alt="Analyzed UI" 
                    className={`max-h-[500px] max-w-full rounded-md object-contain shadow-lg border border-border/50 transition-transform duration-500 group-hover:scale-[1.03] ${showFixPreview ? 'blur-sm grayscale' : ''}`}
                  />
                  
                  {showFixPreview && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-background/80 backdrop-blur-sm text-center"
                    >
                      <Sparkles className="h-10 w-10 text-primary mb-4" />
                      <h3 className="text-xl font-bold mb-2">Improved Layout Suggested</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {result.fixPlan && result.fixPlan.length > 0 ? result.fixPlan[0] : "Better typography, unified spacing, and contrast."}
                      </p>
                      <Button variant="default" size="sm" onClick={() => setShowFixPreview(false)}>
                        Close Preview
                      </Button>
                    </motion.div>
                  )}
                </div>
                <div className="p-4 border-t border-border bg-background/50 flex justify-center">
                  <Button 
                    variant="secondary" 
                    onClick={() => setShowFixPreview(!showFixPreview)}
                    className="w-full gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Wand2 className="h-4 w-4" />
                    {showFixPreview ? 'Hide Preview' : 'Preview Improved UI'}
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col md:col-span-3">
                <CardHeader className="border-b border-border pb-4 md:pb-6 bg-card px-5 md:px-8 pt-5 md:pt-8">
                  <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl tracking-tight">Analysis Complete</CardTitle>
                      <p className="text-sm text-muted-foreground tracking-wide font-medium flex gap-2 items-center">
                        INTERFACE IQ ENGINE v2.0 • {result.mode}
                      </p>
                    </div>
                    
                    <div className="flex items-end gap-4 md:gap-6 mt-4 sm:mt-0">
                      <div className="flex flex-col items-end">
                        <span className={`text-3xl md:text-4xl font-bold tracking-tighter ${readinessColor}`}>
                          {result.shipReadiness}
                          <span className="text-xl md:text-2xl opacity-50">/10</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground tracking-widest font-semibold uppercase mt-1">Suitability</span>
                      </div>
                      
                      <div className="h-10 md:h-12 w-px bg-border hidden sm:block"></div>

                      <div className="flex flex-col items-end">
                        <span className={`text-4xl md:text-5xl font-bold tracking-tighter ${scoreColor}`}>
                          <AnimatedNumber value={result.overallScore} />
                        </span>
                        <span className="text-[10px] text-muted-foreground tracking-widest font-semibold uppercase mt-1">Score</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto px-5 md:px-8 py-5 md:py-6 space-y-6 md:space-y-8 bg-card">
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confidence:</span>
                       <Badge variant={result.confidenceScore > 90 ? 'success' : 'warning'}>
                         {result.confidenceScore}%
                       </Badge>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {result.tags.map((tag, i) => (
                         <Badge key={i} variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <h4 className="font-semibold text-xs text-muted-foreground tracking-widest uppercase">Verdict</h4>
                      <p className="text-lg leading-relaxed font-medium">{result.verdict}</p>
                    </div>
                    
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex gap-3 items-start">
                      <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <div className="space-y-1">
                         <h4 className="font-semibold text-xs text-destructive tracking-widest uppercase">Primary Issue</h4>
                         <p className="text-sm font-medium text-destructive/90">{result.primaryIssue}</p>
                      </div>
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-xs text-muted-foreground tracking-widest uppercase">Metrics</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                      {Object.entries(result.scores).map(([key, value], idx) => {
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        return (
                          <div key={key} className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{label}</span>
                              <span className="font-medium"><AnimatedNumber value={value}/>%</span>
                            </div>
                            <ProgressBar 
                              value={value} 
                              delay={idx * 0.1}
                              indicatorClassName={value > 80 ? 'bg-green-500' : value > 60 ? 'bg-yellow-500' : 'bg-red-500'} 
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 pt-2 border-t border-border mt-4">
                    <div className="space-y-3 pt-4">
                      <h4 className="font-semibold text-xs text-muted-foreground tracking-widest uppercase flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Strengths
                      </h4>
                      <ul className="space-y-2">
                        {result.strengths.map((s, i) => (
                          <li key={i} className="text-sm border-l-2 border-green-500/30 pl-3 py-0.5 text-muted-foreground">{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3 pt-4">
                      <h4 className="font-semibold text-xs text-muted-foreground tracking-widest uppercase flex items-center gap-2">
                        <XCircle className="h-3.5 w-3.5 text-red-500" /> Weaknesses
                      </h4>
                      <ul className="space-y-2">
                        {result.weaknesses.map((w, i) => (
                          <li key={i} className="text-sm border-l-2 border-red-500/30 pl-3 py-0.5 text-muted-foreground">{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {result.fixPlan && result.fixPlan.length > 0 && (
                    <div className="space-y-3 pt-6 border-t border-border">
                      <h4 className="font-semibold text-xs text-blue-400 tracking-widest uppercase flex items-center gap-2">
                         Fix Plan
                      </h4>
                      <ol className="list-decimal list-outside ml-4 space-y-2 text-sm text-muted-foreground">
                        {result.fixPlan.map((f, i) => (
                          <li key={i} className="pl-1 py-0.5">{f}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-card w-full max-w-lg rounded-2xl border border-border/50 shadow-2xl p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold tracking-tight mb-2">Post to Arena ⚔️</h2>
              <p className="text-muted-foreground text-sm mb-6">Give your UI a title so other designers can rate and critique it.</p>
              
              <div className="space-y-4">
                <div className="space-y-1">
                   <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</label>
                   <input 
                     type="text" 
                     value={submitTitle}
                     onChange={(e) => setSubmitTitle(e.target.value)}
                     className="w-full bg-secondary/50 border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-foreground"
                     placeholder="e.g. Neo-Brutalism Dashboard"
                   />
                </div>
                
                <div className="space-y-1">
                   <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description (Optional)</label>
                   <textarea 
                     value={submitDescription}
                     onChange={(e) => setSubmitDescription(e.target.value)}
                     className="w-full bg-secondary/50 border border-border rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm resize-none"
                     placeholder="What were you trying to achieve with this design?"
                   />
                </div>
              </div>
              
              <div className="flex gap-3 justify-end mt-8">
                <Button variant="ghost" onClick={() => setShowSubmitModal(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitToArena} 
                  disabled={!submitTitle || isSubmitting}
                  className="bg-primary hover:bg-primary/90 min-w-[120px]"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  ) : (
                    "Post UI"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

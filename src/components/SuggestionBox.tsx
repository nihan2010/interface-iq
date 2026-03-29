'use client';

import { useState } from 'react';
import { submitRating } from '@/actions/rating';
import { Star, Send, MessageSquarePlus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';

interface SuggestionBoxProps {
  postId: string;
  userExistingRating?: { score: number; feedback?: string | null } | null;
}

export function SuggestionBox({ postId, userExistingRating }: SuggestionBoxProps) {
  const { isSignedIn } = useAuth();
  const [score, setScore] = useState(userExistingRating?.score ?? 0);
  const [hoverScore, setHoverScore] = useState(0);
  const [feedback, setFeedback] = useState(userExistingRating?.feedback ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (score === 0) return;
    setIsSubmitting(true);
    try {
      await submitRating({ postId, score, feedback });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-center space-y-3">
        <MessageSquarePlus className="h-8 w-8 text-muted-foreground mx-auto" />
        <p className="font-semibold text-sm">Sign in to rate & suggest improvements</p>
        <SignInButton mode="modal">
          <Button variant="outline" size="sm">Sign In</Button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      <div className="flex items-center gap-2">
        <MessageSquarePlus className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-base">
          {userExistingRating ? 'Update Your Rating' : 'Rate & Suggest Improvements'}
        </h3>
      </div>

      {/* Star / Number Rating */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your Rating</p>
        <div className="flex gap-1.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onMouseEnter={() => setHoverScore(n)}
              onMouseLeave={() => setHoverScore(0)}
              onClick={() => setScore(n)}
              className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all duration-150
                ${(hoverScore || score) >= n
                  ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-md shadow-primary/20'
                  : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
            >
              {n}
            </button>
          ))}
        </div>
        {score > 0 && (
          <p className="text-xs text-muted-foreground">
            You rated: <span className="font-bold text-primary">{score}/10</span>
            {score >= 9 ? ' 🔥 Outstanding!' : score >= 7 ? ' ✨ Great work!' : score >= 5 ? ' 👍 Decent.' : ' 🛠 Needs work.'}
          </p>
        )}
      </div>

      {/* Suggestion textarea */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Suggestion (Optional)</p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
          placeholder="What would you improve? Be constructive..."
          className="w-full bg-secondary/40 border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition-all"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={score === 0 || isSubmitting}
        className="w-full gap-2 font-semibold"
      >
        {submitted ? (
          <><CheckCircle className="h-4 w-4" /> Saved!</>
        ) : isSubmitting ? (
          <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
        ) : (
          <><Send className="h-4 w-4" /> {userExistingRating ? 'Update Rating' : 'Submit Rating'}</>
        )}
      </Button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  Share2,
  Link2,
  Check,
  MessageCircle,
  X,
} from 'lucide-react';

// Inline X (Twitter) brand icon — lucide-react dropped all brand icons in v1
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface ShareButtonProps {
  postId: string;
  title: string;
  description?: string | null;
  compact?: boolean;
}

export function ShareButton({ postId, title, description, compact = false }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://interfaceiq.vercel.app';
  const postUrl = `${siteUrl}/arena/${postId}`;
  const shareText = description
    ? `${title} — ${description}`
    : `Check out this UI on Interface IQ: ${title}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('input');
      el.value = postUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: postUrl });
        return;
      } catch {
        // user cancelled or not supported, fall through
      }
    }
    setShowPanel((v) => !v);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${postUrl}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`;

  return (
    <div className="relative">
      {/* Main share button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleNativeShare();
        }}
        className={
          compact
            ? "flex items-center justify-center h-8 w-8 rounded-lg bg-background/80 backdrop-blur-sm border border-border/60 shadow hover:bg-background hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
            : "inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/60 hover:bg-secondary px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
        }
        aria-label="Share this post"
      >
        <Share2 className={compact ? "h-3.5 w-3.5" : "h-4 w-4 transition-transform group-hover:rotate-12"} />
        {!compact && 'Share'}
      </button>

      {/* Dropdown panel (desktop fallback) */}
      {showPanel && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPanel(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[220px] rounded-2xl border border-border bg-card shadow-2xl shadow-black/30 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Share this post
            </p>

            {/* Copy Link */}
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/60"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Link2 className="h-4 w-4 text-muted-foreground" />
              )}
              <span>{copied ? 'Link copied!' : 'Copy link'}</span>
            </button>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowPanel(false)}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/60"
            >
              <MessageCircle className="h-4 w-4 text-green-500" />
              <span>WhatsApp</span>
            </a>

            {/* Twitter / X */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowPanel(false)}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/60"
            >
              <XIcon className="h-4 w-4 text-sky-400" />
              <span>Twitter / X</span>
            </a>

            {/* Close */}
            <div className="mt-1 border-t border-border pt-1">
              <button
                onClick={() => setShowPanel(false)}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary/40"
              >
                <X className="h-3.5 w-3.5" />
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

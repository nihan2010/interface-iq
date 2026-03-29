import { getPostWithRatings } from '@/actions/rating';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Badge } from '@/components/ui/Badge';
import { SuggestionBox } from '@/components/SuggestionBox';
import { ArrowLeft, Star, TrendingUp, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Script from 'next/script';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

// ── Dynamic SEO per post ────────────────────────────────────────────────────
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostWithRatings(id);
  if (!post) return { title: 'Post Not Found' };

  const totalRatings = post.ratings.length;
  const avgRating = totalRatings > 0
    ? (post.ratings.reduce((a, r) => a + r.score, 0) / totalRatings).toFixed(1)
    : null;

  const description = [
    post.description,
    post.aiScore != null ? `AI Score: ${post.aiScore}/100.` : null,
    avgRating ? `Community Rating: ${avgRating}/10 from ${totalRatings} review${totalRatings !== 1 ? 's' : ''}.` : null,
  ].filter(Boolean).join(' ') || 'View and rate this UI design on Interface IQ.';

  return {
    title: post.title,
    description,
    openGraph: {
      title: `${post.title} | Interface IQ Arena`,
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Interface IQ Arena`,
      description,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPostWithRatings(id);

  if (!post) notFound();

  const { userId } = await auth();

  // Compute community rating stats
  const totalRatings = post.ratings.length;
  const avgRating = totalRatings > 0
    ? (post.ratings.reduce((a, r) => a + r.score, 0) / totalRatings).toFixed(1)
    : null;

  const userExistingRating = userId
    ? post.ratings.find((r) => r.userId === userId) ?? null
    : null;

  const scoreColor =
    post.aiScore && post.aiScore > 80 ? 'text-green-400' :
    post.aiScore && post.aiScore > 60 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back button */}
      <Link href="/arena" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium mb-8 group transition-colors">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Arena
      </Link>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* ── Left: Image ── */}
        <div className="lg:col-span-3">
          <div className="sticky top-20 rounded-2xl overflow-hidden border border-border shadow-2xl bg-muted/10">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full object-contain max-h-[80vh]"
            />
          </div>
        </div>

        {/* ── Right: Info + Rating ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Description */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-2">{post.title}</h1>
            {post.description && (
              <p className="text-muted-foreground leading-relaxed">{post.description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-3 font-mono">
              Posted {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* AI Metrics */}
          {(post.aiScore != null || post.aiTags.length > 0) && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5" /> AI Analysis
              </p>

              <div className="flex items-end gap-6">
                {post.aiScore != null && (
                  <div>
                    <span className={`text-4xl font-black tracking-tighter ${scoreColor}`}>
                      {post.aiScore}
                    </span>
                    <span className="text-lg text-muted-foreground">/100</span>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">AI Score</p>
                  </div>
                )}
                {post.aiReadiness != null && (
                  <>
                    <div className="h-10 w-px bg-border" />
                    <div>
                      <span className="text-4xl font-black tracking-tighter text-blue-400">
                        {post.aiReadiness}
                      </span>
                      <span className="text-lg text-muted-foreground">/10</span>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Ship Ready</p>
                    </div>
                  </>
                )}
              </div>

              {post.aiTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.aiTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Community Rating Summary */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> Community Rating
            </p>
            {avgRating ? (
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-yellow-400 tracking-tighter">{avgRating}</span>
                <div className="text-sm text-muted-foreground pb-1">
                  <span className="text-foreground font-semibold">{totalRatings}</span> rating{totalRatings !== 1 ? 's' : ''}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No community ratings yet. Be the first!</p>
            )}
          </div>

          {/* Suggestion Box */}
          <SuggestionBox postId={post.id} userExistingRating={userExistingRating} />

          {/* Community Suggestions Feed */}
          {post.ratings.some((r) => r.feedback) && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" /> Community Suggestions ({post.ratings.filter(r => r.feedback).length})
              </p>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {post.ratings.filter((r) => r.feedback).map((r) => (
                  <div key={r.id} className="rounded-xl bg-secondary/40 border border-border/60 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-[10px] font-black text-white">
                          U
                        </div>
                        <span className="text-xs text-muted-foreground">Reviewer</span>
                      </div>
                      <Badge variant="secondary" className="font-mono font-bold text-xs">
                        {r.score}/10
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">{r.feedback}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

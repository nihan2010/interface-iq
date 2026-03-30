import { db } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShareButton } from '@/components/ShareButton';
import { Star, MessageSquare, TrendingUp, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UI Arena — Community Design Ratings',
  description:
    'Browse, rate, and critique UI designs submitted by designers worldwide. See AI scores, community ratings, and leave improvement suggestions.',
  openGraph: {
    title: 'UI Arena — Community Design Ratings | Interface IQ',
    description: 'Browse AI-analyzed UI designs. Rate them, leave suggestions, and discover the best interfaces from the community.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UI Arena — Community Design Ratings | Interface IQ',
    description: 'Browse, rate, and critique UI designs. AI-powered scores + community feedback.',
  },
};


export default async function ArenaPage() {
  const posts = await db.uiPost.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      _count: { select: { ratings: true } },
      ratings: { select: { score: true } },
    },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 md:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl mb-3 md:mb-4">
            The UI Arena ⚔️
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Explore the latest interface submissions. Rate, critique, and see how designs stack up.
          </p>
        </div>
        <Link
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 w-full sm:w-auto text-center rounded-xl font-semibold shadow-xl shadow-primary/20 transition-all hover:-translate-y-1"
        >
          Submit a UI
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed rounded-2xl bg-secondary/20">
          <div className="text-4xl mb-4">🌌</div>
          <h3 className="text-xl font-semibold mb-2">The Arena is Empty</h3>
          <p className="text-muted-foreground">Be the first to upload a UI and claim the top spot!</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {posts.map((post) => {
            const avgRating = post.ratings.length > 0
              ? (post.ratings.reduce((a, r) => a + r.score, 0) / post.ratings.length).toFixed(1)
              : null;
            const scoreColor =
              post.aiScore && post.aiScore > 80 ? 'text-green-400' :
              post.aiScore && post.aiScore > 60 ? 'text-yellow-400' : 'text-red-400';

            return (
              <div key={post.id} className="break-inside-avoid relative group">
                <Link href={`/arena/${post.id}`} className="block">
                  <Card className="overflow-hidden border-border bg-card shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    {/* Image */}
                    <div className="relative w-full bg-muted/20 overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="object-cover w-full aspect-[4/3] transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* AI Score badge overlaid top-right */}
                      {post.aiScore != null && (
                        <div className={`absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 border border-border/50 shadow-lg`}>
                          <TrendingUp className={`w-3 h-3 ${scoreColor}`} />
                          <span className={`text-xs font-black ${scoreColor}`}>{post.aiScore}</span>
                          <span className="text-[10px] text-muted-foreground">/100</span>
                        </div>
                      )}
                      {/* Hover CTA overlay for desktop */}
                      <div className="hidden md:flex absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col items-center justify-center gap-3">
                        <div className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold shadow-xl flex items-center gap-2">
                          <ThumbsUp className="w-4 h-4" /> Rate & Critique
                        </div>
                        <p className="text-xs text-white/80">Click to open post</p>
                      </div>
                    </div>

                    {/* Mobile action bar */}
                    <div className="md:hidden flex flex-row items-center justify-between gap-2 p-3 bg-muted/40 border-t border-border">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {avgRating ? <span className="font-bold text-foreground">{avgRating}</span> : <span>No ratings</span>}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <MessageSquare className="w-3.5 h-3.5" /> View & Rate
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="p-4 bg-background">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-base line-clamp-1">{post.title}</h3>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-yellow-400">{avgRating ?? '—'}</span>
                        </div>
                      </div>
                      {post.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {post.aiTags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">{tag}</Badge>
                        ))}
                        {post._count.ratings > 0 && (
                          <span className="text-xs text-muted-foreground ml-auto">{post._count.ratings} rating{post._count.ratings !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>

                {/* Share button — outside <Link> so it doesn't navigate */}
                <div className="absolute bottom-[72px] right-3 z-10" onClick={(e) => e.preventDefault()}>
                  <ShareButton
                    postId={post.id}
                    title={post.title}
                    description={post.description}
                    compact
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

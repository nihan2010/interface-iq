'use client';

import * as React from 'react';
import { useVibeStore } from '@/store/useVibeStore';
import { Card } from '@/components/ui/Card';
import { User, Image as ImageIcon, History } from 'lucide-react';

export default function ProfilePage() {
  const { history, loadHistory } = useVibeStore();

  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const avgScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.overallScore, 0) / history.length) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center space-x-6 mb-12">
        <div className="h-24 w-24 rounded-full bg-accent flex items-center justify-center">
          <User className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guest User</h1>
          <p className="text-muted-foreground">Local Storage Mode</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        <Card className="p-6 flex items-center space-x-4 border-border bg-card">
          <div className="bg-primary/10 p-3 rounded-lg text-primary">
            <History className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Scans</p>
            <p className="text-3xl font-bold tracking-tight">{history.length}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center space-x-4 border-border bg-card">
          <div className="bg-primary/10 p-3 rounded-lg text-primary">
            <ImageIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Score</p>
            <p className="text-3xl font-bold tracking-tight">{avgScore}%</p>
          </div>
        </Card>
      </div>

      <h2 className="text-xl font-semibold tracking-tight mb-6">Recent Scans</h2>
      {history.length === 0 ? (
        <p className="text-muted-foreground">No recent scans found. Head to the homepage to check a UI.</p>
      ) : (
        <div className="grid gap-4">
          {history.map((h, i) => (
            <Card key={i} className="flex flex-col sm:flex-row p-4 gap-4 items-center border-border bg-card">
              <div className="relative h-20 w-32 bg-muted/30 rounded flex items-center justify-center shrink-0 border border-border/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={h.imageUrl} alt="History scan" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="font-semibold text-lg">{h.overallScore}/100</span>
                  <span className="text-[10px] bg-secondary text-secondary-foreground border border-border px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{h.mode}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{h.verdict}</p>
              </div>
              <div className="text-xs text-muted-foreground shrink-0 font-medium tracking-wide">
                {new Date(h.timestamp).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

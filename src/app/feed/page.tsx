'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowUp, ArrowDown, Activity, Flame } from 'lucide-react';

const MOCK_ARENA = [
  { id: 1, img: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356', score: 92, title: 'Crypto Dashboard' },
  { id: 2, img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', score: 45, title: 'Legacy CRM' },
  { id: 3, img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', score: 78, title: 'E-commerce Checkout' },
  { id: 4, img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3', score: 32, title: 'Internal Tool 1999' },
  { id: 5, img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', score: 88, title: 'Fintech App' },
  { id: 6, img: 'https://images.unsplash.com/photo-1547658719-da2b51169166', score: 61, title: 'Local Bakery Site' },
];

export default function FeedPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">UI Arena</h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">Compare, vote, and learn from public submissions.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2 font-semibold shadow-sm"><Activity className="h-4 w-4"/> Latest</Button>
           <Button variant="secondary" className="gap-2 font-semibold border border-transparent shadow-sm"><Flame className="h-4 w-4 text-orange-500"/> Hot Takes</Button>
        </div>
      </div>

      {/* Compare Mode Section */}
      <div className="mb-16">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
          <Flame className="h-5 w-5 text-orange-500" /> Daily Matchup
        </h2>
        <div className="grid md:grid-cols-2 gap-8 relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-background border-4 border-border font-black text-muted-foreground text-sm uppercase tracking-widest shadow-xl">
            VS
          </div>
          
          <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 group relative shadow-lg hover:shadow-xl">
            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur rounded-full px-3 py-1 text-sm font-bold z-10 border border-border/50 shadow-sm uppercase tracking-widest">
              UI A
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MOCK_ARENA[0].img} alt="UI A" className="w-full h-72 object-cover group-hover:scale-[1.03] transition-transform duration-500" />
            <CardContent className="p-6 relative z-20 bg-card border-t border-border/50">
               <h3 className="font-bold text-xl">{MOCK_ARENA[0].title}</h3>
               <p className="text-sm text-muted-foreground font-medium mb-6 mt-1">Clean, minimalist approach with strong visual hierarchy.</p>
               <div className="flex justify-between items-center">
                 <div className="flex items-baseline gap-1">
                   <span className="font-bold text-3xl text-green-500 tracking-tighter">{MOCK_ARENA[0].score}</span>
                   <span className="text-muted-foreground font-medium text-sm">/100</span>
                 </div>
                 <div className="flex gap-2">
                   <Button size="icon" variant="outline" className="h-10 w-10 hover:bg-green-500/15 hover:text-green-600 hover:border-green-500/30 transition-all shadow-sm"><ArrowUp className="h-5 w-5"/></Button>
                   <Button size="icon" variant="outline" className="h-10 w-10 hover:bg-red-500/15 hover:text-red-600 hover:border-red-500/30 transition-all shadow-sm"><ArrowDown className="h-5 w-5"/></Button>
                 </div>
               </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 group relative shadow-md hover:shadow-xl opacity-90 hover:opacity-100">
            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur rounded-full px-3 py-1 text-sm font-bold z-10 border border-border/50 shadow-sm uppercase tracking-widest">
              UI B
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MOCK_ARENA[1].img} alt="UI B" className="w-full h-72 object-cover group-hover:scale-[1.03] transition-transform duration-500" />
            <CardContent className="p-6 relative z-20 bg-card border-t border-border/50">
               <h3 className="font-bold text-xl">{MOCK_ARENA[1].title}</h3>
               <p className="text-sm text-muted-foreground font-medium mb-6 mt-1">Cluttered interface featuring poor contrast and scattered focus.</p>
               <div className="flex justify-between items-center">
                 <div className="flex items-baseline gap-1">
                   <span className="font-bold text-3xl text-red-500 tracking-tighter">{MOCK_ARENA[1].score}</span>
                   <span className="text-muted-foreground font-medium text-sm">/100</span>
                 </div>
                 <div className="flex gap-2">
                   <Button size="icon" variant="outline" className="h-10 w-10 hover:bg-green-500/15 hover:text-green-600 hover:border-green-500/30 transition-all shadow-sm"><ArrowUp className="h-5 w-5"/></Button>
                   <Button size="icon" variant="outline" className="h-10 w-10 hover:bg-red-500/15 hover:text-red-600 hover:border-red-500/30 transition-all shadow-sm"><ArrowDown className="h-5 w-5"/></Button>
                 </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6 uppercase tracking-widest text-muted-foreground">Recent Scans</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_ARENA.slice(2).map((item) => (
          <Card key={item.id} className="overflow-hidden group shadow border-border hover:border-primary/30 transition-all">
            <div className="h-44 overflow-hidden relative border-b border-border bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <Button variant="secondary" size="sm" className="w-full opacity-90 hover:opacity-100 font-semibold shadow-md">View Analysis</Button>
              </div>
            </div>
            <CardContent className="p-4 bg-card">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-sm truncate pr-4">{item.title}</h3>
                <span className={`font-bold tracking-tight bg-muted px-1.5 rounded text-sm ${item.score > 80 ? 'text-green-500' : item.score > 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {item.score}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Submitted 2 hours ago</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

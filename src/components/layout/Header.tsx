import Link from 'next/link';
import Image from 'next/image';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { checkIsAdmin } from '@/lib/admin';
import { HeaderAuthButtons } from './HeaderAuthButtons';

export async function Header() {
  const isAdmin = await checkIsAdmin();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 shrink-0">
          <Image src="/logo.png" alt="Interface IQ Logo" width={28} height={28} className="rounded-md" />
          <span className="font-bold tracking-tight hidden sm:inline-block">Interface IQ</span>
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-4">
          <Link href="/arena">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground px-2 sm:px-4 text-xs sm:text-sm">
              UI Arena
            </Button>
          </Link>
          {isAdmin && (
            <Link href="/admin">
              <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 px-2 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-1">
                <ShieldAlert className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
          )}
          {/* Client component — avoids hydration mismatch from mixing async RSC with Clerk client state */}
          <HeaderAuthButtons />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Interface IQ" width={22} height={22} className="rounded-md opacity-80" />
          <span className="text-sm font-semibold text-muted-foreground tracking-tight">Interface IQ</span>
        </div>

        {/* Center: Made with love */}
        <p className="text-sm text-muted-foreground text-center order-last sm:order-none">
          Made from Kerala with ❤️
        </p>

        {/* Right: Creator link */}
        <Link
          href="https://nihanajeeb.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          nihanajeeb.in
        </Link>
      </div>
    </footer>
  );
}

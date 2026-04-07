import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="Interface IQ" 
            width={24} 
            height={24} 
            className="rounded-md opacity-90 invert grayscale brightness-200" 
          />
          <span className="text-sm font-bold text-muted-foreground tracking-tighter uppercase">Interface IQ</span>
        </div>

        {/* Center: Made with love */}
        <p className="text-sm text-muted-foreground text-center order-last sm:order-none">
          Made from Kerala with ❤️
        </p>

        {/* Right: Creator link */}
        <Link
          href="https://nihannajeeb.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          nihannajeeb.in
        </Link>
      </div>
    </footer>
  );
}

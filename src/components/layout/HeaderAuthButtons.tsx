'use client';

import { SignInButton, Show, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';

export function HeaderAuthButtons() {
  return (
    <>
      <Show when="signed-in">
        <div className="mx-1">
          <UserButton />
        </div>
      </Show>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground px-2 sm:px-4 text-xs sm:text-sm">
            Sign In
          </Button>
        </SignInButton>
      </Show>
    </>
  );
}

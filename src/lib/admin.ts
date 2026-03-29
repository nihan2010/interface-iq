import { currentUser } from '@clerk/nextjs/server';

export const ADMIN_EMAIL = 'nihannajeebpmkd@gmail.com';

/**
 * Validates if the currently logged-in user matches the hardcoded Admin email
 * @returns boolean
 */
export async function checkIsAdmin() {
  try {
    const user = await currentUser();
    if (!user) return false;
    
    // Check if any of the user's verified email addresses match the Admin email
    const hasAdminEmail = user.emailAddresses.some(
      (email) => email.emailAddress.toLowerCase() === ADMIN_EMAIL.toLowerCase()
    );
    
    return hasAdminEmail;
  } catch (error) {
    // Failsafe for Clerk's Keyless Mode API timeouts
    console.warn("Failed to securely verify admin status due to Clerk backend timeout.", error);
    return false;
  }
}

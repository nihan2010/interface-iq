'use server';

export async function checkDomainIsAlive(urlInput: string) {
  try {
    // Basic formatting
    let formattedUrl = urlInput.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    // Validate URL structure
    new URL(formattedUrl);

    // Perform an HTTP request to check if it's reachable.
    // Using fetch with an abort controller to ensure it doesn't hang forever.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    // We use a GET request because some servers reject HEAD or return 405.
    const response = await fetch(formattedUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; InterfaceIQBot/1.0)',
      },
    });

    clearTimeout(timeoutId);

    // Consider 2xx and 3xx as alive status, and even 4xx might mean the domain exists 
    // but the specific page has an issue. If it responds, the domain is alive.
    // We'll consider any response a success for "domain is alive".
    if (!response.ok && response.status >= 500) {
      return { alive: false, error: `Website returned a server error (${response.status})` };
    }

    return { alive: true, url: formattedUrl };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return { alive: false, error: 'Connection timed out. Website might be down.' };
    }
    return { alive: false, error: 'Website is unreachable or invalid domain.' };
  }
}

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/arena', '/arena/'],
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: 'https://interfaceiq.vercel.app/sitemap.xml',
  };
}

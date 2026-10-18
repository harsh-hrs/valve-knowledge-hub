// Site identity, shared by the page metadata, sitemap and visible credits.
export const SITE_URL = 'https://valve-knowledge-hub.pages.dev';
export const SITE_NAME = 'ValveHub';
export const AUTHOR = 'Harsh Raj Singh';

// Link-preview (Open Graph) block for a page with its own title. Next.js replaces the layout's
// openGraph as a whole when a page sets one, so the site name has to be repeated here.
export function pageOpenGraph(title: string, description: string, path: string) {
  return { type: 'website' as const, siteName: `${SITE_NAME} by ${AUTHOR}`, title, description, url: path };
}

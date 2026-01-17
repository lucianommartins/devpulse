import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feed, FeedItem } from '../models/feed.model';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class ScraperService {
  private http = inject(HttpClient);
  private cache = inject(CacheService);

  // Use a CORS proxy for fetching pages
  private readonly CORS_PROXY = 'https://corsproxy.io/?';

  /**
   * Scrape a blog's listing page for article links, then fetch each article
   */
  async scrapeBlog(feed: Feed, hoursAgo: number = 48): Promise<FeedItem[]> {
    try {
      const startTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

      // Fetch cached items first
      const cachedItems = await this.getCachedItems(feed.id, startTime);
      const cachedUrls = new Set(cachedItems.map(item => item.url));

      // Fetch the blog listing page
      const pageUrl = encodeURIComponent(feed.url);
      const html = await this.http.get(
        `${this.CORS_PROXY}${pageUrl}`,
        { responseType: 'text' }
      ).toPromise();

      if (!html) {
        return cachedItems;
      }

      // Parse article links from the listing page
      const articleUrls = this.extractArticleLinks(html, feed.url);
      console.log(`Found ${articleUrls.length} article links from ${feed.name}`);

      // Filter out already cached URLs
      const newUrls = articleUrls.filter(url => !cachedUrls.has(url));

      // Fetch each new article (limit to 5 to avoid rate limits)
      const newItems: FeedItem[] = [];
      for (const url of newUrls.slice(0, 5)) {
        try {
          const item = await this.fetchArticle(url, feed);
          if (item) {
            newItems.push(item);
            await this.cache.set(item);
          }
        } catch (e) {
          console.warn(`Error fetching article ${url}:`, e);
        }
      }

      // Return all items sorted by date
      return [...newItems, ...cachedItems]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    } catch (error) {
      console.error(`Error scraping blog ${feed.name}:`, error);
      const startTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
      return this.getCachedItems(feed.id, startTime);
    }
  }

  /**
   * Extract article links from a listing page
   */
  private extractArticleLinks(html: string, baseUrl: string): string[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = new Set<string>();

    // Find all links
    const anchors = doc.querySelectorAll('a[href]');

    for (const anchor of Array.from(anchors)) {
      let href = anchor.getAttribute('href') || '';

      // Skip empty, anchor-only, or non-article links
      if (!href || href === '#' || href.startsWith('javascript:')) continue;

      // Skip navigation/category links
      if (href.includes('/tag/') || href.includes('/category/') || href.includes('/author/')) continue;
      if (href.includes('/page/') || href.includes('?page=')) continue;
      if (href.includes('/topics/') || href.includes('/search')) continue;
      if (href.includes('/feed') || href.includes('/rss')) continue;
      if (href.includes('/about') || href.includes('/contact') || href.includes('/privacy')) continue;

      // Skip if URL is too short (likely a category)
      const pathParts = href.split('/').filter(p => p.length > 0);
      if (pathParts.length < 3) continue;

      // Make absolute URL
      if (!href.startsWith('http')) {
        try {
          const base = new URL(baseUrl);
          href = new URL(href, base.origin).toString();
        } catch {
          continue;
        }
      }

      // Skip external links
      try {
        const linkHost = new URL(href).hostname;
        const baseHost = new URL(baseUrl).hostname;
        if (!linkHost.includes(baseHost.replace('www.', '')) &&
          !baseHost.includes(linkHost.replace('www.', ''))) {
          continue;
        }
      } catch {
        continue;
      }

      // Count path segments (skip homepage and shallow category pages)
      const url = new URL(href);
      const pathSegments = url.pathname.split('/').filter(p => p.length > 0);

      // For blog.google, articles have 4+ segments like /technology/ai/google-gemini/gemini-article-title/
      // Skip if too few segments (likely category page)
      if (pathSegments.length < 3) continue;

      // Skip common non-article patterns
      const lastPart = pathSegments[pathSegments.length - 1] || '';
      const skipPatterns = ['products', 'outreach', 'research', 'technology', 'ai', 'cloud',
        'developers', 'news', 'blog', 'articles', 'topics', 'about'];
      if (skipPatterns.includes(lastPart.toLowerCase())) continue;

      // Accept URLs that have a slug-like last part (contains hyphens) or date pattern
      const hasDatePattern = /\/20\d{2}\//.test(href);
      const hasSlug = lastPart.includes('-') && lastPart.length > 10;

      if (hasDatePattern || hasSlug) {
        links.add(href);
      }
    }

    console.log(`Found ${links.size} article URLs from ${baseUrl}`);
    console.log('Article URLs:', Array.from(links));
    return Array.from(links);
  }

  /**
   * Fetch and parse a single article page
   */
  private async fetchArticle(url: string, feed: Feed): Promise<FeedItem | null> {
    const encodedUrl = encodeURIComponent(url);
    const html = await this.http.get(
      `${this.CORS_PROXY}${encodedUrl}`,
      { responseType: 'text' }
    ).toPromise();

    if (!html) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract title
    const title = this.extractTitle(doc);
    if (!title) return null;

    // Extract content
    const content = this.extractContent(doc);

    // Extract date
    const publishedAt = this.extractDate(doc, url);

    // Extract image
    const imageUrl = this.extractImage(doc, url);

    // Generate unique ID from URL
    const id = `scrape_${feed.id}_${this.hashString(url)}`;

    return {
      id,
      feedId: feed.id,
      feedName: feed.name,
      feedType: 'blog',
      title,
      content: content || title,
      author: feed.name,
      publishedAt,
      url,
      mediaUrls: imageUrl ? [imageUrl] : undefined,
      selected: false
    };
  }

  private extractTitle(doc: Document): string {
    // Try og:title first
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
    if (ogTitle) return ogTitle.trim();

    // Try h1
    const h1 = doc.querySelector('h1');
    if (h1?.textContent?.trim()) return h1.textContent.trim();

    // Try title tag
    const title = doc.querySelector('title');
    if (title?.textContent?.trim()) return title.textContent.trim().split('|')[0].trim();

    return '';
  }

  private extractContent(doc: Document): string {
    // Try common article content selectors
    const selectors = [
      'article',
      '[class*="article-body"]',
      '[class*="post-content"]',
      '[class*="entry-content"]',
      '[class*="content"]',
      'main',
      '.post',
      '.blog-post'
    ];

    for (const selector of selectors) {
      const el = doc.querySelector(selector);
      if (el) {
        // Get all paragraphs
        const paragraphs = el.querySelectorAll('p');
        if (paragraphs.length > 0) {
          const text = Array.from(paragraphs)
            .map(p => p.textContent?.trim())
            .filter(t => t && t.length > 50)
            .join(' ');
          if (text.length > 100) {
            return text.substring(0, 800) + (text.length > 800 ? '...' : '');
          }
        }
      }
    }

    // Fallback: try meta description
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content');
    if (description) return description;

    return '';
  }

  private extractDate(doc: Document, url?: string): Date {
    // Try time element
    const timeEl = doc.querySelector('time[datetime]');
    if (timeEl) {
      const datetime = timeEl.getAttribute('datetime');
      if (datetime) {
        const parsed = new Date(datetime);
        if (!isNaN(parsed.getTime())) return parsed;
      }
    }

    // Try published date meta (various properties)
    const dateMetaSelectors = [
      'meta[property="article:published_time"]',
      'meta[property="og:published_time"]',
      'meta[name="date"]',
      'meta[name="publish-date"]',
      'meta[name="DC.date.issued"]'
    ];

    for (const selector of dateMetaSelectors) {
      const meta = doc.querySelector(selector);
      if (meta) {
        const content = meta.getAttribute('content');
        if (content) {
          const parsed = new Date(content);
          if (!isNaN(parsed.getTime())) return parsed;
        }
      }
    }

    // Try to extract date from URL (e.g., /2024/01/15/)
    if (url) {
      const dateMatch = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
      if (dateMatch) {
        const parsed = new Date(
          parseInt(dateMatch[1]),
          parseInt(dateMatch[2]) - 1,
          parseInt(dateMatch[3])
        );
        if (!isNaN(parsed.getTime())) return parsed;
      }

      // Try simpler pattern /2024/01/
      const monthMatch = url.match(/\/(\d{4})\/(\d{2})\//);
      if (monthMatch) {
        const parsed = new Date(
          parseInt(monthMatch[1]),
          parseInt(monthMatch[2]) - 1,
          1
        );
        if (!isNaN(parsed.getTime())) return parsed;
      }
    }

    // Try JSON-LD
    const jsonLd = doc.querySelector('script[type="application/ld+json"]');
    if (jsonLd?.textContent) {
      try {
        const data = JSON.parse(jsonLd.textContent);
        const datePublished = data.datePublished || data['@graph']?.[0]?.datePublished;
        if (datePublished) {
          const parsed = new Date(datePublished);
          if (!isNaN(parsed.getTime())) return parsed;
        }
      } catch { }
    }

    return new Date();
  }

  private extractImage(doc: Document, baseUrl: string): string | undefined {
    // Try og:image
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
    if (ogImage) return this.makeAbsolute(ogImage, baseUrl);

    // Try first large image in article
    const images = doc.querySelectorAll('article img, main img');
    for (const img of Array.from(images)) {
      const src = img.getAttribute('src') || img.getAttribute('data-src');
      if (src && !src.includes('avatar') && !src.includes('icon')) {
        return this.makeAbsolute(src, baseUrl);
      }
    }

    return undefined;
  }

  private makeAbsolute(url: string, baseUrl: string): string {
    if (url.startsWith('http')) return url;
    try {
      const base = new URL(baseUrl);
      return new URL(url, base.origin).toString();
    } catch {
      return url;
    }
  }

  private async getCachedItems(feedId: string, since: Date): Promise<FeedItem[]> {
    const cached = await this.cache.getByFeed(feedId);
    return cached.filter(item => new Date(item.publishedAt) >= since);
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}

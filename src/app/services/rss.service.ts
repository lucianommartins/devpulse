import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feed, FeedItem } from '../models/feed.model';
import { CacheService } from './cache.service';

interface RSSItem {
  title?: string;
  description?: string;
  content?: string;
  link?: string;
  pubDate?: string;
  published?: string;
  author?: string;
  creator?: string;
  enclosure?: {
    url?: string;
    type?: string;
  };
  media?: {
    url?: string;
  };
}

interface ParsedFeed {
  items: RSSItem[];
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RssService {
  private http = inject(HttpClient);
  private cache = inject(CacheService);

  // Use a CORS proxy for RSS feeds
  private readonly CORS_PROXY = 'https://corsproxy.io/?';

  /**
   * Fetch RSS/Atom feed items within the time window
   */
  async fetchFeed(feed: Feed, hoursAgo: number = 48): Promise<FeedItem[]> {
    try {
      const startTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

      // Fetch cached items first
      const cachedItems = await this.getCachedItems(feed.id, startTime);
      const cachedIds = new Set(cachedItems.map(item => item.id));

      // Fetch feed from URL
      const feedUrl = encodeURIComponent(feed.url);
      const response = await this.http.get(
        `${this.CORS_PROXY}${feedUrl}`,
        { responseType: 'text' }
      ).toPromise();

      if (!response) {
        return cachedItems;
      }

      // Parse the feed
      const parsed = this.parseFeed(response);
      const items = this.convertToFeedItems(parsed, feed, startTime);

      // Filter out already cached items
      const newItems = items.filter(item => !cachedIds.has(item.id));

      // Cache new items
      for (const item of newItems) {
        await this.cache.set(item);
      }

      // Return all items sorted by date
      return [...newItems, ...cachedItems]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    } catch (error) {
      console.error(`Error fetching RSS feed ${feed.name}:`, error);
      const startTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
      return this.getCachedItems(feed.id, startTime);
    }
  }

  private parseFeed(xml: string): ParsedFeed {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');

    // Try RSS format first
    let items = Array.from(doc.querySelectorAll('item'));

    // Try Atom format if no RSS items found
    if (items.length === 0) {
      items = Array.from(doc.querySelectorAll('entry'));
    }

    const feedTitle = doc.querySelector('channel > title, feed > title')?.textContent || '';

    return {
      title: feedTitle,
      items: items.map(item => this.parseItem(item))
    };
  }

  private parseItem(item: Element): RSSItem {
    const getContent = (selectors: string[]): string => {
      for (const selector of selectors) {
        const el = item.querySelector(selector);
        if (el?.textContent) {
          return el.textContent.trim();
        }
      }
      return '';
    };

    const getLink = (): string => {
      // RSS format
      const rssLink = item.querySelector('link')?.textContent?.trim();
      if (rssLink) return rssLink;

      // Atom format
      const atomLink = item.querySelector('link[href]')?.getAttribute('href');
      if (atomLink) return atomLink;

      return '';
    };

    const getMediaUrl = (): string | undefined => {
      const enclosure = item.querySelector('enclosure[url]');
      if (enclosure) {
        const type = enclosure.getAttribute('type') || '';
        if (type.startsWith('image/')) {
          return enclosure.getAttribute('url') || undefined;
        }
      }

      const mediaContent = item.querySelector('media\\:content[url], content[url]');
      if (mediaContent) {
        return mediaContent.getAttribute('url') || undefined;
      }

      // Extract first image from content
      const content = getContent(['content\\:encoded', 'content', 'description']);
      const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
      if (imgMatch) {
        return imgMatch[1];
      }

      return undefined;
    };

    return {
      title: getContent(['title']),
      description: getContent(['description', 'summary']),
      content: getContent(['content\\:encoded', 'content']),
      link: getLink(),
      pubDate: getContent(['pubDate', 'published', 'updated', 'dc\\:date']),
      author: getContent(['author', 'dc\\:creator', 'creator']),
      media: {
        url: getMediaUrl()
      }
    };
  }

  private convertToFeedItems(parsed: ParsedFeed, feed: Feed, since: Date): FeedItem[] {
    return parsed.items
      .map(item => {
        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

        // Skip items older than the time window
        if (pubDate < since) {
          return null;
        }

        const content = item.content || item.description || '';
        // Strip HTML tags for display
        const cleanContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

        return {
          id: `rss_${this.hashString(item.link || item.title || '')}`,
          feedId: feed.id,
          feedName: feed.name,
          feedType: feed.type,
          title: item.title,
          content: cleanContent.substring(0, 500) + (cleanContent.length > 500 ? '...' : ''),
          author: item.author || feed.name,
          publishedAt: pubDate,
          url: item.link || '',
          mediaUrls: item.media?.url ? [item.media.url] : undefined,
          selected: false
        } as FeedItem;
      })
      .filter((item): item is FeedItem => item !== null);
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

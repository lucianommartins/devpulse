import { Injectable, signal, computed } from '@angular/core';
import { Feed, FeedItem } from '../models/feed.model';

const FEEDS_STORAGE_KEY = 'devpulse-feeds';
const ENABLED_TYPES_KEY = 'devpulse-enabled-types';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  feeds = signal<Feed[]>([]);

  // Track enabled feed types (twitter, rss, blog)
  private _enabledTypes = signal<Set<string>>(new Set(['twitter', 'rss', 'blog']));

  // Computed to expose enabled types as reactive
  enabledTypes = computed(() => this._enabledTypes());

  constructor() {
    this.loadFeeds();
    this.loadEnabledTypes();
  }

  private loadFeeds(): void {
    const stored = localStorage.getItem(FEEDS_STORAGE_KEY);
    if (stored) {
      try {
        const feeds = JSON.parse(stored) as Feed[];
        this.feeds.set(feeds);
      } catch {
        this.initializeDefaultFeeds();
      }
    } else {
      this.initializeDefaultFeeds();
    }
  }

  private loadEnabledTypes(): void {
    const stored = localStorage.getItem(ENABLED_TYPES_KEY);
    if (stored) {
      try {
        const types = JSON.parse(stored) as string[];
        this._enabledTypes.set(new Set(types));
      } catch {
        // Keep default all enabled
      }
    }
  }

  private initializeDefaultFeeds(): void {
    // Start with empty feeds - user adds their own sources
    this.feeds.set([]);
    this.saveFeeds();
  }

  private saveFeeds(): void {
    localStorage.setItem(FEEDS_STORAGE_KEY, JSON.stringify(this.feeds()));
  }

  private saveEnabledTypes(): void {
    localStorage.setItem(ENABLED_TYPES_KEY, JSON.stringify([...this._enabledTypes()]));
  }

  private generateId(): string {
    return `feed_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  addFeed(feed: Omit<Feed, 'id' | 'createdAt'>): Feed {
    const newFeed: Feed = {
      ...feed,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.feeds.update(feeds => [...feeds, newFeed]);
    this.saveFeeds();
    return newFeed;
  }

  updateFeed(id: string, updates: Partial<Feed>): void {
    this.feeds.update(feeds =>
      feeds.map(f => f.id === id ? { ...f, ...updates } : f)
    );
    this.saveFeeds();
  }

  removeFeed(id: string): void {
    this.feeds.update(feeds => feeds.filter(f => f.id !== id));
    this.saveFeeds();
  }

  toggleFeed(id: string): void {
    this.feeds.update(feeds =>
      feeds.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f)
    );
    this.saveFeeds();
  }

  /**
   * Enable only this feed (solo mode) - disables all others
   */
  soloFeed(id: string): void {
    this.feeds.update(feeds =>
      feeds.map(f => ({ ...f, enabled: f.id === id }))
    );
    this.saveFeeds();
  }

  /**
   * Enable all feeds
   */
  enableAllFeeds(): void {
    this.feeds.update(feeds =>
      feeds.map(f => ({ ...f, enabled: true }))
    );
    this.saveFeeds();
  }

  // Toggle entire feed type (twitter, rss, blog)
  toggleType(type: string): void {
    this._enabledTypes.update(types => {
      const newTypes = new Set(types);
      if (newTypes.has(type)) {
        newTypes.delete(type);
      } else {
        newTypes.add(type);
      }
      return newTypes;
    });
    this.saveEnabledTypes();
  }

  isTypeEnabled(type: string): boolean {
    return this._enabledTypes().has(type);
  }

  getEnabledFeeds(): Feed[] {
    return this.feeds().filter(f => f.enabled);
  }

  getFeedsByType(type: Feed['type']): Feed[] {
    return this.feeds().filter(f => f.type === type);
  }
}

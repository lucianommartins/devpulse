import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Feed, FeedItem } from '../models/feed.model';
import { CacheService } from './cache.service';
import { UserSettingsService } from './user-settings.service';

interface TwitterUser {
  id: string;
  name: string;
  username: string;
}

interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  attachments?: {
    media_keys?: string[];
  };
}

interface TwitterMedia {
  media_key: string;
  type: string;
  url?: string;
  preview_image_url?: string;
}

interface TwitterResponse {
  data?: TwitterTweet[];
  includes?: {
    users?: TwitterUser[];
    media?: TwitterMedia[];
  };
  meta?: {
    result_count: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TwitterService {
  private http = inject(HttpClient);
  private cache = inject(CacheService);
  private userSettings = inject(UserSettingsService);

  // Use proxy server to avoid CORS issues
  private readonly API_BASE = '/api/twitter';

  private getHeaders(): HttpHeaders {
    const bearerToken = this.userSettings.getTwitterBearerToken();
    if (!bearerToken) {
      throw new Error('Twitter Bearer Token não configurado. Configure em ⚙️ Configurações.');
    }
    return new HttpHeaders({ 'X-Twitter-Bearer-Token': bearerToken });
  }

  /**
   * Fetch tweets from a user within the time window
   */
  async fetchTweets(feed: Feed, hoursAgo: number = 48): Promise<FeedItem[]> {
    const username = feed.url.replace('@', '');

    try {
      // Calculate start time for the query
      const startTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

      // First, get user ID
      const userId = await this.getUserId(username);
      if (!userId) {
        console.warn(`Could not find Twitter user: ${username}`);
        return [];
      }

      // Fetch tweets from cache first
      const cachedItems = await this.getCachedTweets(feed.id, startTime);
      const cachedIds = new Set(cachedItems.map(item => item.id));

      // Fetch new tweets from API
      const newTweets = await this.fetchUserTweets(userId, username, feed, startTime);

      // Filter out already cached tweets
      const uncachedTweets = newTweets.filter(tweet => !cachedIds.has(tweet.id));

      // Cache new tweets
      for (const tweet of uncachedTweets) {
        await this.cache.set(tweet);
      }

      // Combine and return all tweets
      return [...uncachedTweets, ...cachedItems]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    } catch (error) {
      console.error(`Error fetching tweets for ${username}:`, error);
      // Return cached items on error
      const startTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
      return this.getCachedTweets(feed.id, startTime);
    }
  }

  private async getUserId(username: string): Promise<string | null> {
    try {
      const response = await this.http.get<{ data?: { id: string } }>(
        `${this.API_BASE}/users/by/username/${username}`,
        { headers: this.getHeaders() }
      ).toPromise();
      return response?.data?.id || null;
    } catch {
      return null;
    }
  }

  private async fetchUserTweets(
    userId: string,
    username: string,
    feed: Feed,
    startTime: Date
  ): Promise<FeedItem[]> {
    const params = new URLSearchParams({
      'tweet.fields': 'created_at,author_id,attachments',
      'expansions': 'author_id,attachments.media_keys',
      'media.fields': 'url,preview_image_url,type',
      'user.fields': 'name,username',
      'start_time': startTime.toISOString(),
      'max_results': '100',
      'exclude': 'replies,retweets'  // Only original posts
    });

    try {
      const response = await this.http.get<TwitterResponse>(
        `${this.API_BASE}/users/${userId}/tweets?${params.toString()}`,
        { headers: this.getHeaders() }
      ).toPromise();

      if (!response?.data) {
        return [];
      }

      const users = new Map<string, TwitterUser>();
      response.includes?.users?.forEach(user => users.set(user.id, user));

      const media = new Map<string, TwitterMedia>();
      response.includes?.media?.forEach(m => media.set(m.media_key, m));

      return response.data.map(tweet => {
        const author = users.get(tweet.author_id);
        const mediaUrls = tweet.attachments?.media_keys
          ?.map(key => {
            const m = media.get(key);
            return m?.url || m?.preview_image_url;
          })
          .filter((url): url is string => !!url);

        return {
          id: `twitter_${tweet.id}`,
          feedId: feed.id,
          feedName: feed.name,
          feedType: 'twitter' as const,
          content: tweet.text,
          author: author?.name || username,
          authorHandle: `@${author?.username || username}`,
          publishedAt: new Date(tweet.created_at),
          url: `https://twitter.com/${username}/status/${tweet.id}`,
          mediaUrls,
          selected: false
        };
      });
    } catch (error) {
      console.error('Error fetching tweets:', error);
      return [];
    }
  }

  private async getCachedTweets(feedId: string, since: Date): Promise<FeedItem[]> {
    const cached = await this.cache.getByFeed(feedId);
    return cached.filter(item => new Date(item.publishedAt) >= since);
  }
}

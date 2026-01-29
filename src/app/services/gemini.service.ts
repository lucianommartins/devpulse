/**
 * GeminiService - Main service for AI content generation
 * Refactored to use modular prompts and parsers
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FeedItem, GeneratedThread, ThreadTweet } from '../models/feed.model';
import { UserSettingsService } from './user-settings.service';
import { I18nService } from '../i18n';
import { Platform, PlatformContent } from '../models/platform-content.model';
import { LoggerService } from './logger.service';
import { StatsService } from './stats.service';

// Modular imports
import { buildPlatformPrompt, buildTwitterPrompt, buildRegenerateTweetPrompt } from './gemini/platform-prompts';
import { parseThreadResponse, parsePlatformResponse } from './gemini/response-parsers';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private http = inject(HttpClient);
  private userSettings = inject(UserSettingsService);
  private i18n = inject(I18nService);
  private logger = inject(LoggerService);
  private stats = inject(StatsService);

  private readonly API_BASE = '/api/gemini';

  private getApiKey(): string {
    const apiKey = this.userSettings.getGeminiApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key não configurada. Configure em ⚙️ Configurações.');
    }
    return apiKey;
  }

  /**
   * Make a request to Gemini API
   */
  private async callGeminiApi(prompt: string, additionalUrls: string[] = [], options: { temperature?: number; maxTokens?: number } = {}): Promise<string> {
    const requestBody: any = {
      apiKey: this.getApiKey(),
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: options.temperature ?? 0.8,
        topP: 0.95,
        maxOutputTokens: options.maxTokens ?? 4096
      }
    };

    if (additionalUrls.length > 0) {
      requestBody.tools = [{ url_context: {} }];
    }

    const response = await this.http.post<GeminiResponse>(
      `${this.API_BASE}/generate`,
      requestBody
    ).toPromise();

    if (response?.error) {
      throw new Error(response.error.message || 'API error');
    }

    return response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  /**
   * Generate a Twitter thread from selected feed items
   */
  async generateThread(items: FeedItem[], additionalUrls: string[] = []): Promise<GeneratedThread> {
    const lang = this.i18n.getLanguageForPrompt();
    const prompt = buildTwitterPrompt(items, additionalUrls, lang);

    try {
      const text = await this.callGeminiApi(prompt, additionalUrls);
      const result = parseThreadResponse(text, items);
      this.stats.incrementContentCreated();
      return result;
    } catch (error) {
      this.logger.error('GeminiService', 'Error generating thread:', error);
      throw new Error('Falha ao gerar thread. Verifique sua API key do Gemini.');
    }
  }

  /**
   * Regenerate a specific tweet in the thread
   */
  async regenerateTweet(thread: GeneratedThread, tweetIndex: number, feedback?: string): Promise<ThreadTweet> {
    const tweet = thread.tweets.find(t => t.index === tweetIndex);
    if (!tweet) {
      throw new Error('Tweet not found');
    }

    const lang = this.i18n.getLanguageForPrompt();
    const prompt = buildRegenerateTweetPrompt(tweet.content, lang, feedback);

    try {
      const newContent = await this.callGeminiApi(prompt, [], { temperature: 0.9, maxTokens: 300 });

      // Clean up any markdown formatting the model might add
      const cleanContent = newContent
        .replace(/^["']|["']$/g, '')
        .trim();

      return {
        ...tweet,
        content: cleanContent
      };
    } catch (error) {
      this.logger.error('GeminiService', 'Error regenerating tweet:', error);
      throw error;
    }
  }

  /**
   * Generate content for a specific platform
   */
  async generateContentForPlatform(
    platform: Platform,
    items: FeedItem[],
    additionalUrls: string[] = []
  ): Promise<PlatformContent> {
    const lang = this.i18n.getLanguageForPrompt();
    const prompt = buildPlatformPrompt(platform, items, additionalUrls, lang);

    try {
      const text = await this.callGeminiApi(prompt, additionalUrls);
      const result = parsePlatformResponse(platform, text, items);
      this.stats.incrementContentCreated();
      return result;
    } catch (error) {
      this.logger.error('GeminiService', `Error generating ${platform} content:`, error);
      throw new Error(`Failed to generate ${platform} content.`);
    }
  }

  /**
   * Generate content from adhoc URL and/or image
   * Uses url_context for URLs and inline_data for images
   */
  async generateFromAdhoc(url?: string, imageBase64?: string): Promise<GeneratedThread> {
    if (!url && !imageBase64) {
      throw new Error('NO_INPUT');
    }

    const lang = this.i18n.getLanguageForPrompt();

    // Build the adhoc prompt
    let prompt = `You are a social media content specialist. Generate an engaging Twitter thread based on the provided content.

Language: ${lang}

`;

    if (url) {
      prompt += `Analyze the content from this URL: ${url}

`;
    }

    if (imageBase64) {
      prompt += `Also analyze the provided image and incorporate its content/context into the thread.

`;
    }

    prompt += `Create a Twitter thread with 4-6 tweets that:
1. Starts with a hook that grabs attention
2. Provides key insights or information
3. Ends with a call to action or thought-provoking question
4. Uses relevant emojis and hashtags
5. **Media**: For each tweet where an image or video would be impactful, include a placeholder with a generation prompt.

Format your response as a JSON object:
{
  "tweets": [
    {
      "index": 1,
      "content": "Tweet 1 text here (max 280 chars)",
      "media": {
        "type": "image",
        "prompt": "Detailed prompt for image generation...",
        "tool": "nanobanana"
      }
    },
    {
      "index": 2,
      "content": "Tweet 2 text here",
      "media": null
    }
  ],
  "summary": "Brief summary of the content"
}

For videos, use "type": "video" and "tool": "veo3".
If no media, use "media": null.
IMPORTANT: When generating media prompts, always use light theme. Include bright, colorful backgrounds for images and videos.`;

    try {
      // Build request body
      const requestBody: any = {
        apiKey: this.getApiKey(),
        model: 'gemini-3-flash-preview',
        config: {
          temperature: 0.8,
          topP: 0.95,
          maxOutputTokens: 4096
        }
      };

      // Handle different content types
      if (imageBase64 && url) {
        // Both image and URL
        requestBody.contents = [
          { text: prompt },
          {
            inline_data: {
              mime_type: 'image/png',
              data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
            }
          }
        ];
        requestBody.tools = [{ url_context: {} }];
      } else if (imageBase64) {
        // Image only
        requestBody.contents = [
          { text: prompt },
          {
            inline_data: {
              mime_type: 'image/png',
              data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
            }
          }
        ];
      } else if (url) {
        // URL only
        requestBody.contents = prompt;
        requestBody.tools = [{ url_context: {} }];
      }

      const response = await this.http.post<GeminiResponse>(
        `${this.API_BASE}/generate`,
        requestBody
      ).toPromise();

      if (response?.error) {
        // Check for URL access errors
        if (response.error.message?.includes('URL') ||
          response.error.message?.includes('fetch') ||
          response.error.message?.includes('access')) {
          throw new Error('URL_NOT_ACCESSIBLE');
        }
        throw new Error(response.error.message || 'API error');
      }

      const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Parse the response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            id: `adhoc-${Date.now()}`,
            tweets: parsed.tweets.map((t: any) => ({
              index: t.index,
              content: t.content,
              sourceIds: [],
              hashtags: [],
              mediaPlaceholder: t.media ? {
                type: t.media.type,
                prompt: t.media.prompt,
                tool: t.media.tool || 'nanobanana'
              } : undefined
            })),
            sourceItems: [],
            generatedAt: new Date()
          };
        }
      } catch (parseError) {
        this.logger.warn('GeminiService', 'Failed to parse JSON response, extracting tweets from text');
      }

      // Fallback: extract tweets from plain text
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      const tweets = lines.slice(0, 5).map((content, index) => ({
        index: index + 1,
        content: content.replace(/^\d+\.\s*/, '').trim(),
        sourceIds: [],
        hashtags: []
      }));

      return {
        id: `adhoc-${Date.now()}`,
        tweets,
        sourceItems: [],
        generatedAt: new Date()
      };

    } catch (error: any) {
      this.logger.error('GeminiService', 'Error generating adhoc content:', error);

      if (error.message === 'URL_NOT_ACCESSIBLE' || error.message === 'NO_INPUT') {
        throw error;
      }

      throw new Error('GENERATION_FAILED');
    }
  }

  /**
   * Generate adhoc content for a specific platform (LinkedIn, Threads, Bluesky)
   */
  async generateFromAdhocForPlatform(
    platform: 'linkedin' | 'threads' | 'bluesky',
    url?: string,
    imageBase64?: string
  ): Promise<PlatformContent> {
    if (!url && !imageBase64) {
      throw new Error('NO_INPUT');
    }

    const lang = this.i18n.getLanguageForPrompt();
    const platformNames: Record<string, string> = {
      linkedin: 'LinkedIn',
      threads: 'Threads',
      bluesky: 'Bluesky'
    };
    const platformLimits: Record<string, number> = {
      linkedin: 3000,
      threads: 500,
      bluesky: 300
    };

    const prompt = `You are a social media specialist. Create a ${platformNames[platform]} post based on the provided content.

Language: ${lang}
Character limit: ${platformLimits[platform]}

${url ? `Analyze content from: ${url}` : ''}
${imageBase64 ? 'Also analyze the provided image and incorporate its context.' : ''}

Create 1-3 engaging posts optimized for ${platformNames[platform]} that:
1. Use appropriate tone for the platform
2. Include relevant hashtags
3. Have a compelling hook
4. Stay within character limits

Format response as JSON:
{
  "posts": [
    { "index": 1, "content": "Post content here" }
  ]
}`;

    try {
      const requestBody: any = {
        apiKey: this.getApiKey(),
        model: 'gemini-3-flash-preview',
        config: {
          temperature: 0.8,
          topP: 0.95,
          maxOutputTokens: 2048
        }
      };

      if (imageBase64 && url) {
        requestBody.contents = [
          { text: prompt },
          {
            inline_data: {
              mime_type: 'image/png',
              data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
            }
          }
        ];
        requestBody.tools = [{ url_context: {} }];
      } else if (imageBase64) {
        requestBody.contents = [
          { text: prompt },
          {
            inline_data: {
              mime_type: 'image/png',
              data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
            }
          }
        ];
      } else if (url) {
        requestBody.contents = prompt;
        requestBody.tools = [{ url_context: {} }];
      }

      const response = await this.http.post<GeminiResponse>(
        `${this.API_BASE}/generate`,
        requestBody
      ).toPromise();

      if (response?.error) {
        if (response.error.message?.includes('URL') ||
          response.error.message?.includes('fetch')) {
          throw new Error('URL_NOT_ACCESSIBLE');
        }
        throw new Error(response.error.message || 'API error');
      }

      const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Parse response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          this.stats.incrementContentCreated();
          return {
            platform,
            posts: parsed.posts.map((p: any) => ({
              text: p.content || p.text
            }))
          };
        }
      } catch (parseError) {
        this.logger.warn('GeminiService', 'Failed to parse JSON, extracting from text');
      }

      // Fallback
      const lines = text.split('\n').filter(l => l.trim());
      this.stats.incrementContentCreated();
      return {
        platform,
        posts: lines.slice(0, 3).map((line) => ({
          text: line.replace(/^\d+\.\s*/, '').trim()
        }))
      };

    } catch (error: any) {
      this.logger.error('GeminiService', `Error generating adhoc ${platform} content:`, error);
      if (error.message === 'URL_NOT_ACCESSIBLE' || error.message === 'NO_INPUT') {
        throw error;
      }
      throw new Error('GENERATION_FAILED');
    }
  }
}

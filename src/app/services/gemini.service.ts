import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FeedItem, GeneratedThread, ThreadTweet } from '../models/feed.model';
import { UserSettingsService } from './user-settings.service';
import { I18nService } from '../i18n';

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

  // Use proxy server
  private readonly API_BASE = '/api/gemini';

  private getApiKey(): string {
    const apiKey = this.userSettings.getGeminiApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key não configurada. Configure em ⚙️ Configurações.');
    }
    return apiKey;
  }

  /**
   * Generate a Twitter thread from selected feed items
   */
  async generateThread(items: FeedItem[], additionalUrls: string[] = []): Promise<GeneratedThread> {
    const prompt = this.buildPrompt(items, additionalUrls);

    // Build request body with API key from user settings
    const requestBody: any = {
      apiKey: this.getApiKey(),
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 4096
      }
    };

    // Add URL context tool if there are additional URLs
    if (additionalUrls.length > 0) {
      requestBody.tools = [{ url_context: {} }];
    }

    try {
      const response = await this.http.post<GeminiResponse>(
        `${this.API_BASE}/generate`,
        requestBody
      ).toPromise();

      if (response?.error) {
        throw new Error(response.error.message || 'API error');
      }

      const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return this.parseThreadResponse(text, items);

    } catch (error) {
      console.error('Error generating thread:', error);
      throw new Error('Falha ao gerar thread. Verifique sua API key do Gemini.');
    }
  }

  private buildPrompt(items: FeedItem[], additionalUrls: string[] = []): string {
    const lang = this.i18n.getLanguageForPrompt();

    const contentSummary = items.map((item, i) => {
      const title = item.title ? `Title: ${item.title}\n` : '';
      return `
### Content ${i + 1}
Source: ${item.feedName} (${item.authorHandle || item.author})
${title}Content: ${item.content}
URL: ${item.url}
Date: ${new Date(item.publishedAt).toLocaleDateString('en-US')}
`;
    }).join('\n');

    // Add additional URLs section if provided
    const additionalUrlsSection = additionalUrls.length > 0
      ? `\n## Additional URLs for Context\nPlease access and use the content from these URLs to enrich the thread:\n${additionalUrls.map((url, i) => `${i + 1}. ${url}`).join('\n')}\n`
      : '';

    return `You are an expert at creating viral Twitter/X threads in ${lang}.

## Task
Create a Twitter thread based on the content below. The thread must:

1. **Format**: Each tweet must have a MAXIMUM of 280 characters
2. **Language**: ${lang}, professional but accessible tone
3. **Engagement**: Use copywriting techniques to maximize engagement:
   - First tweet with a strong hook (curiosity or value promise)
   - Strategic emojis (don't overdo it)
   - Rhetorical questions
   - Bullets for easy reading
   - CTA at the end (like, share, follow)
4. **Structure**: 
   - Tweet 1: Impactful hook/opening
   - Tweets 2-N: Development of main points
   - Second-to-last tweet: Links to original sources (REQUIRED to include URLs from reference content)
   - Last tweet: Conclusion + CTA
5. **Media**: For each tweet where an image or video would be impactful, include a placeholder with a generation prompt.
6. **Links**: IMPORTANT - Include links to original sources in one of the tweets. Use format: "🔗 Sources: [links]"

## Reference Content
${contentSummary}
${additionalUrlsSection}
## Response Format
Respond EXACTLY in this JSON format:
{
  "tweets": [
    {
      "index": 1,
      "content": "Tweet 1 text...",
      "media": {
        "type": "image",
        "prompt": "Prompt for Google Imagen to generate the image...",
        "tool": "imagen"
      }
    },
    {
      "index": 2,
      "content": "Tweet 2 text...",
      "media": null
    }
  ]
}

For videos, use "type": "video" and "tool": "veo3".
If no media, use "media": null.

Generate the thread now:`;
  }

  private parseThreadResponse(text: string, sourceItems: FeedItem[]): GeneratedThread {
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      const tweets: ThreadTweet[] = parsed.tweets.map((tweet: any) => ({
        index: tweet.index,
        content: tweet.content,
        mediaPlaceholder: tweet.media ? {
          type: tweet.media.type as 'image' | 'video',
          prompt: tweet.media.prompt,
          tool: tweet.media.tool as 'veo3' | 'imagen'
        } : undefined
      }));

      return {
        id: `thread_${Date.now()}`,
        tweets,
        generatedAt: new Date(),
        sourceItems: sourceItems.map(item => item.id)
      };

    } catch (error) {
      console.error('Error parsing thread response:', error);
      return {
        id: `thread_${Date.now()}`,
        tweets: [{
          index: 1,
          content: 'Erro ao processar a thread. Por favor, tente novamente.',
          mediaPlaceholder: undefined
        }],
        generatedAt: new Date(),
        sourceItems: sourceItems.map(item => item.id)
      };
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
    const prompt = `Rewrite this tweet into ${lang}. The original tweet may be in any language.

Original tweet: "${tweet.content}"
${feedback ? `User feedback: ${feedback}` : ''}

Rules:
- Maximum 280 characters
- Output MUST be in ${lang}
- Keep the context and meaning of the original tweet
- Use Twitter engagement techniques for ${lang} audience

Reply ONLY with the text of the new tweet, no explanations.`;

    try {
      const response = await this.http.post<GeminiResponse>(
        `${this.API_BASE}/generate`,
        {
          apiKey: this.getApiKey(),
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: {
            temperature: 0.9,
            maxOutputTokens: 300
          }
        }
      ).toPromise();

      const newContent = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || tweet.content;

      // Clean up any markdown formatting the model might add
      const cleanContent = newContent
        .replace(/^["']|["']$/g, '')  // Remove surrounding quotes
        .trim();

      return {
        ...tweet,
        content: cleanContent
      };

    } catch (error) {
      console.error('Error regenerating tweet:', error);
      throw error;
    }
  }
}

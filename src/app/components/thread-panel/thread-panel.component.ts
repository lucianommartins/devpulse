import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncService } from '../../services/sync.service';
import { GeminiService } from '../../services/gemini.service';
import { MediaService, GeneratedMedia } from '../../services/media.service';
import { GeneratedThread, ThreadTweet } from '../../models/feed.model';
import { I18nService } from '../../i18n';

@Component({
  selector: 'app-thread-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thread-panel.component.html',
  styleUrl: './thread-panel.component.css'
})
export class ThreadPanelComponent {
  syncService = inject(SyncService);
  geminiService = inject(GeminiService);
  mediaService = inject(MediaService);
  i18n = inject(I18nService);

  thread = signal<GeneratedThread | null>(null);
  isGenerating = signal(false);
  error = signal<string | null>(null);
  copiedIndex = signal<number | null>(null);

  // Media generation state
  generatingMediaIndex = signal<number | null>(null);
  mediaProgress = signal<string>('');
  generatedMedia = signal<Map<number, GeneratedMedia>>(new Map());

  // Prompt editing state
  editingPromptIndex = signal<number | null>(null);
  editedPrompts = signal<Map<number, string>>(new Map());

  // URL context state
  showUrlInput = signal(false);
  additionalUrls = signal('');

  get selectedItems() {
    return this.syncService.selectedItems;
  }

  get selectedCount() {
    return this.syncService.selectedCount;
  }

  async generateThread(): Promise<void> {
    const items = this.selectedItems();
    if (items.length === 0) return;

    this.isGenerating.set(true);
    this.error.set(null);
    this.generatedMedia.set(new Map()); // Clear previous media

    // Parse additional URLs
    const urlsText = this.additionalUrls().trim();
    const additionalUrls = urlsText ? urlsText.split('\n').map(u => u.trim()).filter(u => u) : [];

    try {
      const result = await this.geminiService.generateThread(items, additionalUrls);
      this.thread.set(result);
      // Mark selected items as used after successful generation
      this.syncService.markSelectedAsUsed();
    } catch (err: any) {
      this.error.set(err.message || 'Erro ao gerar thread');
    } finally {
      this.isGenerating.set(false);
    }
  }

  async regenerateTweet(index: number): Promise<void> {
    const currentThread = this.thread();
    if (!currentThread) return;

    try {
      const newTweet = await this.geminiService.regenerateTweet(currentThread, index);
      this.thread.update(t => {
        if (!t) return t;
        return {
          ...t,
          tweets: t.tweets.map(tweet =>
            tweet.index === index ? newTweet : tweet
          )
        };
      });
    } catch (err) {
      console.error('Error regenerating tweet:', err);
    }
  }

  async generateMedia(tweet: ThreadTweet): Promise<void> {
    if (!tweet.mediaPlaceholder) return;

    const { type } = tweet.mediaPlaceholder;
    // Use edited prompt if available, otherwise use original
    const prompt = this.getEditedPrompt(tweet.index) || tweet.mediaPlaceholder.prompt;

    this.generatingMediaIndex.set(tweet.index);
    this.mediaProgress.set('');

    try {
      let media: GeneratedMedia;

      if (type === 'image') {
        this.mediaProgress.set(this.i18n.t.thread.generatingImage);
        media = await this.mediaService.generateImage(prompt);
      } else {
        media = await this.mediaService.generateVideo(prompt, (status) => {
          this.mediaProgress.set(status);
        });
      }

      this.generatedMedia.update(map => {
        const newMap = new Map(map);
        newMap.set(tweet.index, media);
        return newMap;
      });

    } catch (err: any) {
      console.error('Media generation error:', err);
      this.mediaProgress.set(`Erro: ${err.message}`);
    } finally {
      this.generatingMediaIndex.set(null);
    }
  }

  // Prompt editing methods
  isEditingPrompt(index: number): boolean {
    return this.editingPromptIndex() === index;
  }

  getEditedPrompt(index: number): string | undefined {
    return this.editedPrompts().get(index);
  }

  toggleEditPrompt(index: number): void {
    if (this.editingPromptIndex() === index) {
      this.editingPromptIndex.set(null);
    } else {
      this.editingPromptIndex.set(index);
    }
  }

  updateEditedPrompt(index: number, event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.editedPrompts.update(map => {
      const newMap = new Map(map);
      newMap.set(index, value);
      return newMap;
    });
  }

  saveEditPrompt(index: number): void {
    this.editingPromptIndex.set(null);
  }

  cancelEditPrompt(index: number): void {
    this.editedPrompts.update(map => {
      const newMap = new Map(map);
      newMap.delete(index);
      return newMap;
    });
    this.editingPromptIndex.set(null);
  }

  getGeneratedMedia(index: number): GeneratedMedia | undefined {
    return this.generatedMedia().get(index);
  }

  isGeneratingMedia(index: number): boolean {
    return this.generatingMediaIndex() === index;
  }

  downloadMedia(media: GeneratedMedia, tweetIndex: number): void {
    if (media.type === 'image' && media.data) {
      const link = document.createElement('a');
      link.href = `data:${media.mimeType};base64,${media.data}`;
      link.download = `tweet_${tweetIndex}_image.png`;
      link.click();
    } else if (media.type === 'video' && media.url) {
      const link = document.createElement('a');
      link.href = media.url;
      link.download = `tweet_${tweetIndex}_video.mp4`;
      link.click();
    }
  }

  clearGeneratedMedia(index: number): void {
    this.generatedMedia.update(map => {
      const newMap = new Map(map);
      newMap.delete(index);
      return newMap;
    });
    // This will show the placeholder again, allowing prompt editing
  }

  copyTweet(tweet: ThreadTweet): void {
    navigator.clipboard.writeText(tweet.content).then(() => {
      this.copiedIndex.set(tweet.index);
      setTimeout(() => this.copiedIndex.set(null), 2000);
    });
  }

  copyThread(): void {
    const thread = this.thread();
    if (!thread) return;

    const fullText = thread.tweets
      .map((t, i) => `${i + 1}/${thread.tweets.length}\n${t.content}`)
      .join('\n\n---\n\n');

    navigator.clipboard.writeText(fullText).then(() => {
      this.copiedIndex.set(-1); // -1 indicates full thread copied
      setTimeout(() => this.copiedIndex.set(null), 2000);
    });
  }

  clearThread(): void {
    this.thread.set(null);
    this.error.set(null);
    this.generatedMedia.set(new Map());
  }

  getCharCount(content: string): number {
    return content.length;
  }

  getCharCountClass(count: number): string {
    if (count > 280) return 'over';
    if (count > 260) return 'warning';
    return 'ok';
  }

  getMediaIcon(type: 'image' | 'video'): string {
    return type === 'image' ? '🖼️' : '🎬';
  }

  getToolLabel(tool: 'veo3' | 'imagen'): string {
    return tool === 'veo3' ? 'Veo 3.1' : 'Nano Banana';
  }

  // URL context methods
  toggleUrlInput(): void {
    this.showUrlInput.update(v => !v);
  }

  updateAdditionalUrls(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.additionalUrls.set(value);
  }
}

import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedService } from '../../services/feed.service';
import { SyncService } from '../../services/sync.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { I18nService } from '../../i18n';
import { Feed } from '../../models/feed.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  feedService = inject(FeedService);
  syncService = inject(SyncService);
  userSettings = inject(UserSettingsService);
  i18n = inject(I18nService);
  common = this.i18n.t.common;

  @Output() openSettings = new EventEmitter<void>();

  showAddForm = signal(false);
  editingFeedId = signal<string | null>(null);
  newFeedName = signal('');
  newFeedUrl = signal('');
  newFeedType = signal<Feed['type']>('twitter');

  get feeds() {
    return this.feedService.feeds;
  }

  get timeWindow() {
    return this.syncService.timeWindowHours;
  }

  get isLoading() {
    return this.syncService.isLoading;
  }

  onTimeWindowChange(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.syncService.setTimeWindow(value);
  }

  getTimeWindowLabel(): string {
    const hours = this.timeWindow();
    if (hours < 24) {
      return `${hours}h`;
    }
    const days = Math.floor(hours / 24);
    return `${days}d`;
  }

  async onSync(): Promise<void> {
    // Check if Gemini API key is configured
    if (!this.userSettings.hasGeminiApiKey()) {
      this.openSettings.emit();
      return;
    }
    await this.syncService.syncAll();
  }

  toggleFeed(id: string): void {
    this.feedService.toggleFeed(id);
  }

  removeFeed(id: string): void {
    this.feedService.removeFeed(id);
  }

  /**
   * Enable only this feed (solo mode)
   */
  soloFeed(id: string): void {
    this.feedService.soloFeed(id);
  }

  getFeedIcon(type: Feed['type']): string {
    switch (type) {
      case 'twitter':
        return '𝕏';
      case 'rss':
        return '📡';
      case 'blog':
        return '📝';
      default:
        return '📄';
    }
  }

  getFeedIconClass(type: Feed['type']): string {
    switch (type) {
      case 'twitter':
        return 'icon-twitter';
      case 'rss':
        return 'icon-rss';
      case 'blog':
        return 'icon-blog';
      default:
        return '';
    }
  }

  openAddForm(): void {
    this.showAddForm.set(true);
    this.editingFeedId.set(null);
    this.newFeedName.set('');
    this.newFeedUrl.set('');
    // Default to twitter if bearer token exists, otherwise blog
    this.newFeedType.set(this.userSettings.hasTwitterBearerToken() ? 'twitter' : 'blog');
  }

  editFeed(feed: Feed): void {
    this.showAddForm.set(true);
    this.editingFeedId.set(feed.id);
    this.newFeedName.set(feed.name);
    this.newFeedUrl.set(feed.url);
    this.newFeedType.set(feed.type);
  }

  cancelAddForm(): void {
    this.showAddForm.set(false);
    this.editingFeedId.set(null);
    this.newFeedName.set('');
    this.newFeedUrl.set('');
    this.newFeedType.set('twitter');
  }

  saveFeed(): void {
    if (!this.newFeedName() || !this.newFeedUrl()) return;

    const editId = this.editingFeedId();
    if (editId) {
      // Update existing feed
      this.feedService.updateFeed(editId, {
        name: this.newFeedName(),
        url: this.newFeedUrl(),
        type: this.newFeedType()
      });
    } else {
      // Add new feed
      this.feedService.addFeed({
        name: this.newFeedName(),
        url: this.newFeedUrl(),
        type: this.newFeedType(),
        enabled: true
      });
    }

    this.cancelAddForm();
  }
}

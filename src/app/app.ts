import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TrackResult } from './models/track-result.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SearchStateService } from './services/search-state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export enum ViewMode {
  List = 'list',
  Tile = 'tile'
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App implements OnInit {
  public searchQuery: string = '';
  public ViewMode: typeof ViewMode = ViewMode; 
  public viewMode = ViewMode.List;
  public selectedTrack: TrackResult | null = null;
  public isFlying: boolean = false; 
  public isPlaying: boolean = false;
  public safeEmbedUrl: SafeResourceUrl | null = null;

  constructor(
    public searchState: SearchStateService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const savedView = localStorage.getItem('preferred_view_mode') as ViewMode;
    if (savedView) {
      this.viewMode = savedView;
    }
  }

  public onSearch(): void {
    if (this.searchQuery.trim()) {
      this.searchState.triggerSearch(this.searchQuery);
    }
  }

  public onHistorySelect(term: string): void {
    this.searchQuery = term;
    this.searchState.triggerSearch(term);
  }

  public onNextPage(): void {
    if (this.searchState.nextCursor) {
      this.searchState.triggerSearch(this.searchState.currentQuery, this.searchState.nextCursor);
    }
  }

  public onPrevPage(): void {
    if (this.searchState.prevCursor) {
      this.searchState.triggerSearch(this.searchState.currentQuery, this.searchState.prevCursor);
    }
  }

  public toggleViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    localStorage.setItem('preferred_view_mode', mode);
  }

  public onSelectTrack(track: TrackResult): void {
    this.isFlying = true;
    this.isPlaying = false; 
    this.safeEmbedUrl = null;

    setTimeout(() => {
      this.selectedTrack = track;
      this.isFlying = false;
    }, 400);
  }

  public onPlayCentralImage(): void {
    if (this.selectedTrack) {
      this.safeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedTrack.audioEmbedUrl);
      this.isPlaying = true;
    }
  }

  public onRetry(): void {
    if (this.searchState.currentQuery) {
      this.searchState.triggerSearch(this.searchState.currentQuery);
    }
  }
}

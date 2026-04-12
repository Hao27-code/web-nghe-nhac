import {Component, OnDestroy, OnInit} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { Music } from '../../models/music.model';
import { MusicService } from '../../services/music.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-music-card',
  templateUrl: './music-card.component.html',
  styleUrls: ['./music-card.component.scss'],
})
export class MusicCardComponent implements OnInit, OnDestroy {
  @Input() music!: Music;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() play = new EventEmitter<Music>();

  isHovered = false;
  isPlaying = false;
  progressPercent = 0;

  private subscriptions: Subscription = new Subscription();

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private musicService: MusicService) {}

  ngOnInit() {
    // Theo dõi bài hát đang phát
    this.subscriptions.add(
      this.musicService.currentMusic$.subscribe(currentMusic => {
        this.isPlaying = currentMusic?.id === this.music.id;
      })
    );

    // Theo dõi thời gian để cập nhật progress
    this.subscriptions.add(
      this.musicService.currentTime$.subscribe(currentTime => {
        if (this.isPlaying && this.music.duration) {
          this.progressPercent = (currentTime / this.music.duration) * 100;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onPlayClick(event: Event) {
    event.stopPropagation();
    this.play.emit(this.music);
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

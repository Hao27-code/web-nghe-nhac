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
  @Input() cardType: 'default' | 'resume' = 'default'; // Thêm input để phân biệt loại card
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() play = new EventEmitter<Music>();

  isHovered = false;
  isPlaying = false;
  resumeTime = 0; // Thời gian đã nghe (cho badge)

  private subscriptions: Subscription = new Subscription();

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private musicService: MusicService) {}

  ngOnInit() {
    // Lấy thời gian đã lưu từ service
    this.resumeTime = this.musicService.getSavedTime(this.music.id);

    // Nếu cardType là 'resume' và music có resumeTime, ưu tiên dùng giá trị đó
    if (this.cardType === 'resume' && (this.music as any).resumeTime) {
      this.resumeTime = (this.music as any).resumeTime;
    }

    // Theo dõi trạng thái phát nhạc hiện tại
    this.subscriptions.add(
      this.musicService.currentMusic$.subscribe(currentMusic => {
        if (currentMusic && currentMusic.id === this.music.id) {
          this.subscriptions.add(
            this.musicService.isPlaying$.subscribe(isPlaying => {
              this.isPlaying = isPlaying;
            })
          );
        } else {
          this.isPlaying = false;
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
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  formatTime(seconds: number): string {
    if (!seconds || seconds <= 0) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

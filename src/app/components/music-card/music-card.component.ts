import {Component, OnDestroy, OnInit} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { Music } from '../../models/music.model';
import { MusicService } from '../../services/music.service';
import { Subscription } from 'rxjs';
import {IonIcon} from "@ionic/angular/standalone";

@Component({
  selector: 'app-music-card',
  templateUrl: './music-card.component.html',
  styleUrls: ['./music-card.component.scss'],
  imports: [
    IonIcon
  ]
})
export class MusicCardComponent implements OnInit, OnDestroy {
  @Input() music!: Music;

  @Input() cardType: 'default' | 'resume' = 'default'; // Thêm input để phân biệt loại card
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() play = new EventEmitter<Music>();

  isHovered = false;
  isPlaying = false;
  resumeTime = 0; // Thời gian đã nghe (cho badge)
  isCurrentMusic = false;

  private subscriptions: Subscription = new Subscription();

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private musicService: MusicService) {}

  ngOnInit() {
    this.resumeTime = this.musicService.getSavedTime(this.music.id);

    // Lắng nghe bài hát đang phát
    this.subscriptions.add(
      this.musicService.currentMusic$.subscribe(currentMusic => {
        this.isCurrentMusic = currentMusic?.id === this.music.id;
        if (this.isCurrentMusic) {
          this.isPlaying = this.musicService.getIsPlayingValue();
        } else {
          this.isPlaying = false;
        }
      })
    );

    // Lắng nghe trạng thái phát
    this.subscriptions.add(
      this.musicService.isPlaying$.subscribe(playing => {
        if (this.isCurrentMusic) {
          this.isPlaying = playing;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // Xử lý click vào nút play
  onPlayClick(event: Event) {
    event.stopPropagation();
    console.log('Play button clicked:', this.music.title);
    this.playMusic();
  }
  // Xử lý click vào card
  onCardClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.closest('.play-button')) {
      return;
    }
    console.log('Music card clicked:', this.music.title);
    this.playMusic();
  }


  formatDuration(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  formatTime(seconds: number): string {
    return this.formatDuration(seconds);
  }
  // Hàm phát nhạc
  private playMusic() {
    if (this.isCurrentMusic && this.isPlaying) {
      this.musicService.pauseMusic();
    } else if (this.isCurrentMusic && !this.isPlaying) {
      this.musicService.resumeMusic();
    } else {
      const savedTime = this.musicService.getSavedTime(this.music.id);
      this.musicService.playMusic(this.music, savedTime);
    }
  }
}

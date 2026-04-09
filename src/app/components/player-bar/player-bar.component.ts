import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { Music } from '../../models/music.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-player-bar',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss'],
})
export class PlayerBarComponent implements OnInit, OnDestroy {
  private musicService = inject(MusicService);

  currentMusic: Music | null = null;
  isPlaying = false;
  currentTime = 0;
  duration = 0;

  private subscriptions: Subscription = new Subscription();

  ngOnInit() {
    this.subscriptions.add(
      this.musicService.currentMusic$.subscribe(music => {
        this.currentMusic = music;
      })
    );

    this.subscriptions.add(
      this.musicService.isPlaying$.subscribe(playing => {
        this.isPlaying = playing;
      })
    );

    this.subscriptions.add(
      this.musicService.currentTime$.subscribe(time => {
        this.currentTime = time;
      })
    );

    this.subscriptions.add(
      this.musicService.duration$.subscribe(duration => {
        this.duration = duration;
      })
    );
  }

  onPlayPause() {
    if (this.isPlaying) {
      this.musicService.pauseMusic();
    } else {
      this.musicService.resumeMusic();
    }
  }

  onNext() {
    this.musicService.playNext();
  }

  onToggleFavorite() {
    if (this.currentMusic) {
      this.musicService.toggleFavorite(this.currentMusic);
    }
  }

  isFavorite(): boolean {
    return this.currentMusic ? this.musicService.isFavorite(this.currentMusic) : false;
  }

  onSeek(event: any) {
    const seekTime = (event.target.value / 100) * this.duration;
    this.musicService.seekTo(seekTime);
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getProgressPercent(): number {
    if (this.duration > 0 && this.currentTime >= 0) {
      return (this.currentTime / this.duration) * 100;
    }
    return 0;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

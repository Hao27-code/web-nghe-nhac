import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { Music } from '../../models/music.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  play, pause, playSkipForward, playSkipBack, heart, heartOutline,
  volumeHigh, volumeMedium, volumeLow, volumeMute, shuffle, repeat,
  ellipsisHorizontal
} from 'ionicons/icons';

@Component({
  selector: 'app-player-bar',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss'],
})
export class PlayerBarComponent implements OnInit, OnDestroy {

  constructor() {
    addIcons({
      play, pause, playSkipForward, playSkipBack, heart, heartOutline,
      volumeHigh, volumeMedium, volumeLow, volumeMute, shuffle, repeat,
      ellipsisHorizontal
    });
  }
  private musicService = inject(MusicService);

  currentMusic: Music | null = null; //bài hát đang phát
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 80;
  isMuted = false;
  isShuffle = false;
  isRepeat = false;


  private subscriptions: Subscription = new Subscription();

  ngOnInit() {
    // Lấy bài hát đang phát
    this.subscriptions.add(
      this.musicService.currentMusic$.subscribe(music => {
        this.currentMusic = music;
      })
    );
    // Lấy trạng thái phát
    this.subscriptions.add(
      this.musicService.isPlaying$.subscribe(playing => {
        this.isPlaying = playing;
      })
    );
// Lấy thời gian hiện tại
    this.subscriptions.add(
      this.musicService.currentTime$.subscribe(time => {
        this.currentTime = time;

      })
    );
// Lấy tổng thời lượng
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
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  onPrevious() {
    const musicList = this.musicService.getMusicList();
    if (this.currentMusic) {
      const currentIndex = musicList.findIndex(m => m.id === this.currentMusic!.id);
      const prevIndex = currentIndex === 0 ? musicList.length - 1 : currentIndex - 1;
      this.musicService.playMusic(musicList[prevIndex]);
    }
  }
  onShuffle() {
    this.isShuffle = !this.isShuffle;
    console.log('Shuffle:', this.isShuffle);
  }

  onRepeat() {
    this.isRepeat = !this.isRepeat;
    console.log('Repeat:', this.isRepeat);
  }

  onVolumeChange(event: any) {
    this.volume = event.target.value;
    this.isMuted = false;
    if (this.musicService.getAudio()) {
      this.musicService.getAudio()!.volume = this.volume / 100;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.musicService.getAudio()) {
      this.musicService.getAudio()!.volume = this.isMuted ? 0 : this.volume / 100;
    }
  }
  getVolumeIcon() {
    if (this.isMuted || this.volume === 0) return 'volume-mute';
    if (this.volume < 30) return 'volume-low';
    if (this.volume < 70) return 'volume-medium';
    return 'volume-high';
  }
  onSeekProgress(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const percent = Math.max(0, Math.min(1, x / width));
    const seekTime = percent * this.duration;
    this.musicService.seekTo(seekTime);
  }
  onSeekVolume(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    let percent = Math.max(0, Math.min(1, x / width));
    percent = Math.round(percent * 100);
    this.volume = percent;
    this.isMuted = false;
    const audio = this.musicService.getAudioElement();
    if (audio) {
      audio.volume = this.volume / 100;
    }
  }


}

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";
import { ChangeDetectorRef } from '@angular/core';

export interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  durationSeconds: number;
  coverColor: string;
  coverImage?: string;
  audioUrl: string;
  liked?: boolean;
  progress?: number; // Cho phép undefined
  currentTime?: number; // Cho phép undefined
}

@Component({
  selector: 'app-continue-listening',
  templateUrl: './continue-listening.component.html',
  styleUrls: ['./continue-listening.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class ContinueListeningComponent implements OnInit {
  tracks: Track[] = [
    {
      id: 1,
      title: 'Midnight Echoes',
      artist: 'Electric Dreams',
      duration: '2:15',
      durationSeconds: 135, // 2:15 = 135 giây
      coverColor: '#6c5ce7',
      audioUrl: 'assets/music/domdom_J97.mp3',
      liked: false,
      progress: 0,
      currentTime: 0
    },
    {
      id: 2,
      title: 'Vinyl Dreams',
      artist: 'Jazz Masters',
      duration: '3:20',
      durationSeconds: 200, // 3:20 = 200 giây
      coverColor: '#e17055',
      audioUrl: 'assets/music/vinyl-dreams.mp3',
      liked: false,
      progress: 0,
      currentTime: 0
    }
  ];

  currentTrack: Track | null = null;
  isPlaying: boolean = false;
  audio: HTMLAudioElement | null = null;
  currentTime: number = 0;
  duration: number = 0;
  hoveredTrack: number | null = null;
  isSeeking: boolean = false;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    await this.loadProgress(); // Load tiến trình đã lưu
    this.initAudio();
  }

  async initAudio() {
    this.audio = new Audio();

    this.audio.addEventListener('timeupdate', () => {
      if (!this.isSeeking && this.currentTrack) {
        this.currentTime = this.audio?.currentTime || 0;
        // Cập nhật tiến trình realtime
        const progress = (this.currentTime / this.duration) * 100;
        this.currentTrack.progress = progress;
        this.currentTrack.currentTime = this.currentTime;
        this.cdr.detectChanges();
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio?.duration || 0;
      // Nếu có tiến trình đã lưu, seek đến vị trí đó
      if (this.currentTrack && this.currentTrack.currentTime && this.currentTrack.currentTime > 0) {
        this.audio!.currentTime = this.currentTrack.currentTime;
        this.currentTime = this.currentTrack.currentTime;
      }
      this.cdr.detectChanges();
    });

    this.audio.addEventListener('pause', () => {
      this.saveProgress(); // Lưu khi pause
    });

    this.audio.addEventListener('ended', () => {
      this.nextTrack();
    });
  }

  async playTrack(track: Track) {
    if (this.currentTrack?.id === track.id && this.isPlaying) {
      this.pauseAudio();
    } else if (this.currentTrack?.id === track.id && !this.isPlaying) {
      this.resumeAudio();
    } else {
      // Lưu tiến trình bài cũ trước khi chuyển
      await this.saveProgress();

      this.currentTrack = track;
      this.audio!.src = track.audioUrl;
      this.audio!.load();

      // Seek đến vị trí đã lưu
      this.audio!.addEventListener('canplay', () => {
        if (track.currentTime && track.currentTime > 0) {
          this.audio!.currentTime = track.currentTime;
          this.currentTime = track.currentTime;
        }
        this.audio!.play()
          .then(() => {
            this.isPlaying = true;
          })
          .catch(error => {
            console.error('Lỗi phát nhạc:', error);
            this.isPlaying = false;
          });
      }, { once: true });
    }
  }

  pauseAudio() {
    this.audio?.pause();
    this.isPlaying = false;
    this.saveProgress(); // Lưu khi dừng
  }

  resumeAudio() {
    this.audio?.play();
    this.isPlaying = true;
  }

  async saveProgress() {
    if (this.currentTrack && this.currentTrack.currentTime !== undefined) {
      // Lưu vào localStorage
      localStorage.setItem(`track_${this.currentTrack.id}_progress`, JSON.stringify({
        currentTime: this.currentTrack.currentTime,
        progress: this.currentTrack.progress,
        lastPlayed: new Date().toISOString()
      }));

      // Cập nhật trong mảng tracks
      const trackIndex = this.tracks.findIndex(t => t.id === this.currentTrack!.id);
      if (trackIndex !== -1) {
        this.tracks[trackIndex].currentTime = this.currentTrack.currentTime;
        this.tracks[trackIndex].progress = this.currentTrack.progress;
      }
    }
  }

  async loadProgress() {
    for (let track of this.tracks) {
      const saved = localStorage.getItem(`track_${track.id}_progress`);
      if (saved) {
        const data = JSON.parse(saved);
        track.currentTime = data.currentTime;
        track.progress = data.progress;
      }
    }
    this.cdr.detectChanges();
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.resumeAudio();
    }
  }

  previousTrack() {
    if (!this.currentTrack) return;
    this.saveProgress();
    const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack!.id);
    const prevIndex = currentIndex === 0 ? this.tracks.length - 1 : currentIndex - 1;
    this.playTrack(this.tracks[prevIndex]);
  }

  nextTrack() {
    if (!this.currentTrack) return;
    this.saveProgress();
    const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack!.id);
    const nextIndex = (currentIndex + 1) % this.tracks.length;
    this.playTrack(this.tracks[nextIndex]);
  }

  toggleLike() {
    if (this.currentTrack) {
      this.currentTrack.liked = !this.currentTrack.liked;
      localStorage.setItem(`track_${this.currentTrack.id}_liked`, JSON.stringify(this.currentTrack.liked));
    }
  }

  onSeek(event: any) {
    this.isSeeking = true;
    const seekTime = parseFloat(event.target.value);
    this.currentTime = seekTime;
    if (this.currentTrack) {
      this.currentTrack.currentTime = seekTime;
      this.currentTrack.progress = (seekTime / this.duration) * 100;
    }
  }

  onSeekChange(event: any) {
    const seekTime = parseFloat(event.target.value);
    if (this.audio && !isNaN(seekTime)) {
      this.audio.currentTime = seekTime;
      if (this.currentTrack) {
        this.currentTrack.currentTime = seekTime;
        this.currentTrack.progress = (seekTime / this.duration) * 100;
        this.saveProgress();
      }
    }
    this.isSeeking = false;
  }

  getProgressPercent(track: Track): number {
    // Nếu là bài đang phát, lấy progress realtime
    if (this.currentTrack?.id === track.id && this.currentTrack.progress !== undefined) {
      return this.currentTrack.progress;
    }
    // Nếu không, lấy progress đã lưu
    return track.progress || 0;
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  }
}

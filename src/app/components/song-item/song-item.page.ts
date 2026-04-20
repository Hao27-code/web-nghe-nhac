import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import { Input } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import { Music } from '../../models/music.model';
import { MusicService } from '../../services/music.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.page.html',
  styleUrls: ['./song-item.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule]
})
export class SongItemPage implements OnInit, OnDestroy {
  @Input() song!: Music;

  isLiked: boolean = false;
  isCurrentSong: boolean = false;
  isPlaying: boolean = false;

  private subscriptions: Subscription = new Subscription();

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
    console.log('🎵 SongItem mounted:', this.song?.title);
    if (!this.song) return;

    this.isLiked = this.musicService.isFavorite(this.song);

    this.subscriptions.add(
      this.musicService.currentMusic$.subscribe(currentMusic => {
        this.isCurrentSong = currentMusic?.id === this.song.id;
        if (this.isCurrentSong) {
          this.isPlaying = this.musicService.getIsPlayingValue();
        } else {
          this.isPlaying = false;
        }
      })
    );

    this.subscriptions.add(
      this.musicService.isPlaying$.subscribe(playing => {
        if (this.isCurrentSong) {
          this.isPlaying = playing;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Xử lý click vào card
  onCardClick(event: Event): void {
    event.stopPropagation();
    console.log('🖱️ Card clicked:', this.song.title);

    // Phát nhạc trực tiếp
    this.playMusic();
  }

  // Xử lý click nút play
  handlePlayClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    console.log('🖱️ Play button clicked:', this.song.title);
    this.playMusic();
  }

  // Xử lý click nút tim
  toggleLike(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    console.log('❤️ Like button clicked:', this.song.title);
    this.musicService.toggleFavorite(this.song);
    this.isLiked = this.musicService.isFavorite(this.song);
  }

  // Xử lý click nút 3 chấm
  showOptions(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    console.log('🔧 Options clicked:', this.song.title);
    // Thêm action sheet ở đây nếu cần
  }

  // Hàm phát nhạc chính
  private playMusic(): void {
    console.log('🎵 playMusic called for:', this.song.title);

    try {
      if (this.isCurrentSong && this.isPlaying) {
        console.log('⏸️ Pausing current song');
        this.musicService.pauseMusic();
      } else if (this.isCurrentSong && !this.isPlaying) {
        console.log('▶️ Resuming current song');
        this.musicService.resumeMusic();
      } else {
        console.log('🆕 Playing new song');
        const savedTime = this.musicService.getSavedTime(this.song.id);
        console.log('⏱️ Saved time:', savedTime);
        this.musicService.playMusic(this.song, savedTime);
      }
    } catch (error) {
      console.error('❌ Error in playMusic:', error);
    }
  }
}


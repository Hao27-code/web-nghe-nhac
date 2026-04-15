
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Music } from '../../models/music.model';
import { MusicService } from '../../services/music.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-library-song-item',
  templateUrl: './library-song-item.component.html',
  styleUrls: ['./library-song-item.component.scss'],
  imports: [
    IonicModule,CommonModule
  ]
})
export class LibrarySongItemComponent implements OnInit, OnDestroy {

  @Input() song!: Music;

  // ========== SAO CHÉP LOGIC TỪ SONG-ITEM ==========
  isLiked: boolean = false;
  isCurrentSong: boolean = false;
  isPlaying: boolean = false;
  isHovered: boolean = false;

  private subscriptions: Subscription = new Subscription();

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private musicService: MusicService) {}

  ngOnInit() {
    // Logic y hệt SongItemPage
    this.isLiked = this.musicService.isFavorite(this.song);

    this.subscriptions.add(
      this.musicService.currentMusic$.subscribe(currentMusic => {
        this.isCurrentSong = currentMusic?.id === this.song.id;
        if (this.isCurrentSong) {
          this.isPlaying = this.musicService['isPlayingSubject'].value;
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // Format thời gian (giống SongItemPage)
  formatDuration(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Logic play/pause (giống SongItemPage)
  handlePlayClick(event: Event) {
    event.stopPropagation();

    if (this.isCurrentSong && this.isPlaying) {
      this.musicService.pauseMusic();
    } else if (this.isCurrentSong && !this.isPlaying) {
      this.musicService.resumeMusic();
    } else {
      const savedTime = this.musicService.getSavedTime(this.song.id);
      this.musicService.playMusic(this.song, savedTime);
    }
  }

  // Logic yêu thích (giống SongItemPage)
  toggleLike(event: Event) {
    event.stopPropagation();
    this.musicService.toggleFavorite(this.song);
    this.isLiked = this.musicService.isFavorite(this.song);
  }

  // Logic 3 chấm (giống SongItemPage)
  showOptions(event: Event) {
    event.stopPropagation();
    console.log('Options:', this.song.title);
    // Có thể mở action sheet
  }
}

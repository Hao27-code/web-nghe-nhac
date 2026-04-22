import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {CommonModule} from "@angular/common";
import {Subscription} from "rxjs";
import {MusicService} from "../../services/music.service";



export interface Playlist {
  id: number;
  title: string;
  artists: string;
  imageUrl: string;
  songs?: any[];
}


@Component({
  selector: 'app-playlist-card',
  standalone: true,
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.scss'],
  imports: [CommonModule, RouterModule, IonicModule],
})
export class PlaylistCardComponent implements OnInit, OnDestroy {
  @Input() playlist!: Playlist;
  @Output() playClick = new EventEmitter<Playlist>();

  isHovered: boolean = false;
  isPlaying: boolean = false;
  isCurrentPlaylist: boolean = false;
  isLiked: boolean = false;
  private currentPlayingPlaylistId: number | null = null; //Lưu ID playlist đang phát

  private subscriptions: Subscription = new Subscription();

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private musicService: MusicService) {}

  ngOnInit() {
    // Chỉ lắng nghe currentPlaylistId từ service
    this.subscriptions.add(
      this.musicService.currentPlaylistId$.subscribe(playingPlaylistId => {
        // So sánh trực tiếp ID
        this.isCurrentPlaylist = (playingPlaylistId === this.playlist.id);

        if (this.isCurrentPlaylist) {
          this.isPlaying = this.musicService.getIsPlayingValue();
        } else {
          this.isPlaying = false;
        }
      })
    );

    this.subscriptions.add(
      this.musicService.isPlaying$.subscribe(playing => {
        if (this.isCurrentPlaylist) {
          this.isPlaying = playing;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setHover(isHover: boolean) {
    this.isHovered = isHover;
  }

  // Xử lý click vào card (giống library-song-item)
  onCardClick(event: Event) {
    const target = event.target as HTMLElement;
    // Bỏ qua nếu click vào nút play
    if (target.closest('.play-btn')) {
      return;
    }
    console.log('Playlist card clicked:', this.playlist.title);
    this.playPlaylist();
  }

  // Xử lý click vào nút play
  onPlayClick(event: Event) {
    event.stopPropagation();
    console.log('Play button clicked:', this.playlist.title);
    this.playPlaylist();
  }

  // Hàm phát playlist (giống library-song-item)
  private playPlaylist() {
    // Nếu đang phát chính playlist này thì dừng
    if (this.isCurrentPlaylist && this.isPlaying) {
      console.log('Pausing playlist:', this.playlist.title);
      this.musicService.pauseMusic();
      this.musicService.setCurrentPlaylistId(null); // Reset playlist đang phát
    }
    // Nếu đang dừng chính playlist này thì tiếp tục
    else if (this.isCurrentPlaylist && !this.isPlaying) {
      console.log('Resuming playlist:', this.playlist.title);
      this.musicService.resumeMusic();
    }
    // Phát playlist mới
    else {
      if (this.playlist.songs && this.playlist.songs.length > 0) {
        const firstSong = this.playlist.songs[0];
        const savedTime = this.musicService.getSavedTime(firstSong.id);
        console.log('Playing new playlist:', this.playlist.title);
        console.log('First song:', firstSong.title);

        // Lưu ID playlist đang phát TRƯỚC KHI phát nhạc
        this.musicService.setCurrentPlaylistId(this.playlist.id);
        this.musicService.playMusic(firstSong, savedTime);
      } else {
        console.error('No songs in playlist!');
      }
    }
  }
}

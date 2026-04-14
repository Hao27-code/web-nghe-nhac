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
  isCurrentSong: boolean = false;  // Có phải bài đang phát không
  isPlaying: boolean = false;      // Đang phát không

  private subscriptions: Subscription = new Subscription();

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
    // Kiểm tra bài hát có trong danh sách yêu thích không
    this.isLiked = this.musicService.isFavorite(this.song);

    // Lắng nghe bài hát đang phát
    this.subscriptions.add(
      this.musicService.currentMusic$.subscribe(currentMusic => {
        this.isCurrentSong = currentMusic?.id === this.song.id;
        if (this.isCurrentSong) {
          // Nếu là bài hiện tại, lấy trạng thái phát
          this.isPlaying = this.musicService['isPlayingSubject'].value;
        } else {
          this.isPlaying = false;
        }
      })
    );

    // Lắng nghe trạng thái phát
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

  // Xử lý click play/pause
  handlePlayClick(event: Event): void {
    event.stopPropagation();

    if (this.isCurrentSong && this.isPlaying) {
      // Nếu đang phát bài này thì tạm dừng
      this.musicService.pauseMusic();
    } else if (this.isCurrentSong && !this.isPlaying) {
      // Nếu đang dừng bài này thì tiếp tục
      this.musicService.resumeMusic();
    } else {
      // Phát bài mới - lấy thời gian đã lưu từ lịch sử
      const savedTime = this.musicService.getSavedTime(this.song.id);
      this.musicService.playMusic(this.song, savedTime);
    }
  }

  // Xử lý click nút tim
  toggleLike(event: Event): void {
    event.stopPropagation();
    this.musicService.toggleFavorite(this.song);
    this.isLiked = this.musicService.isFavorite(this.song);
  }

  // Xử lý click nút 3 chấm
  showOptions(event: Event): void {
    event.stopPropagation();
    // Có thể hiện action sheet ở đây
    console.log('Options:', this.song.title);
  }
}


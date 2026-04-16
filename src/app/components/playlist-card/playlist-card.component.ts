import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {CommonModule} from "@angular/common";



export interface Playlist {
  id: number;
  title: string;
  artists: string;
  imageUrl: string;
}


@Component({
  selector: 'app-playlist-card',
  standalone: true,
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.scss'],
  imports: [CommonModule, RouterModule, IonicModule],
})
export class PlaylistCardComponent {
  @Input() playlist!: Playlist;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private router: Router) {

  }

  goToPlaylistDetail(): void {
    this.router.navigate(['/playlist', this.playlist.id]);
  }
  handleImageError(event: any): void {
    event.target.src = 'assets/default-image.jpg'; // Ảnh mặc định khi lỗi
  }
  // Xử lý nút play (ngăn click lan ra ngoài)
  onPlay(event: Event): void {
    event.stopPropagation();
    console.log('Play playlist:', this.playlist.title);
    // Thêm logic phát nhạc ở đây
  }

  // Xử lý nút tim (ngăn click lan ra ngoài)
  onToggleFavorite(event: Event): void {
    event.stopPropagation();
    console.log('Toggle favorite:', this.playlist.title);
    // Thêm logic yêu thích ở đây
  }
}

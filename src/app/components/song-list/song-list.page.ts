import {Component, HostListener, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SongItemPage } from '../song-item/song-item.page';
import { Music } from '../../models/music.model';
import { MusicService } from '../../services/music.service';


@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.page.html',
  styleUrls: ['./song-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,SongItemPage, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SongListPage implements OnInit {

  allSongs: Music[] = [];
  displaySongs: Music[] = [];
  isMobile: boolean = false;
  isTablet: boolean = false;
  isDesktop: boolean = false;


  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
    // Lấy danh sách nhạc từ service
    this.allSongs = this.musicService.getMusicList();
    this.checkScreenSize();

    // Lắng nghe sự kiện phát nhạc để cập nhật UI
    this.musicService.currentMusic$.subscribe(() => {
      // Force update UI
      this.displaySongs = [...this.displaySongs];
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    const width = window.innerWidth;
    this.isMobile = width < 577;
    this.isTablet = width >= 577 && width <= 992;
    this.isDesktop = width > 992;
    this.updateDisplaySongs();
  }

  updateDisplaySongs(): void {
    if (this.isDesktop) {
      // DESKTOP: Chỉ hiện 9 bài (3 cột x 3 hàng = 9 bài)
      this.displaySongs = this.allSongs.slice(0, 9);
    } else if (this.isTablet) {
      // TABLET: Chỉ hiện 6 bài (2 cột x 3 hàng = 6 bài)
      this.displaySongs = this.allSongs.slice(0, 6);
    } else {
      // MOBILE: Hiện tất cả để chia slide
      this.displaySongs = [...this.allSongs];
    }
  }

  // Chia mảng thành nhóm 3 bài cho mobile slide
  getSongGroups(): Music[][] {
    const groups: Music[][] = [];
    for (let i = 0; i < this.displaySongs.length; i += 3) {
      groups.push(this.displaySongs.slice(i, i + 3));
    }
    return groups;
  }
}

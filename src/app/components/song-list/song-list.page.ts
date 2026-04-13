import {Component, HostListener, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SongItemPage } from '../song-item/song-item.page';


export interface Song {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
}

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.page.html',
  styleUrls: ['./song-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,SongItemPage, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SongListPage implements OnInit {

  allSongs: Song[] = [];
  displaySongs: Song[] = [];  // Sẽ thay đổi theo device
  isMobile: boolean = false;
  isTablet: boolean = false;
  isDesktop: boolean = false;

  ngOnInit(): void {
    this.loadSongs();
    this.checkScreenSize();
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
    if (this.isTablet) {
      // Tablet: bỏ 3 cái cuối, chỉ hiện 6 bài (2 cột x 3 hàng)
      this.displaySongs = this.allSongs.slice(0, 6);
    } else {
      // Mobile và Desktop: hiện tất cả
      this.displaySongs = [...this.allSongs];
    }
  }

  loadSongs(): void {
    this.allSongs = [
      { id: 1, title: 'Thiên Lý Ơi', artist: 'Jack - J97', imageUrl: 'assets/images/song1.jpg' },
      { id: 2, title: 'Vực Thảm Của Bình Yên', artist: 'Hồ Jack - J97', imageUrl: 'assets/images/song2.jpg' },
      { id: 3, title: 'Chúng Ta Rồi Sẽ Hạnh Phúc', artist: 'Hồ Jack - J97', imageUrl: 'assets/images/song3.jpg' },
      { id: 4, title: 'SỚM MUỘN THÌ', artist: 'ANH TRAI "SAY HI", Hustlang Robber', imageUrl: 'assets/images/song4.jpg' },
      { id: 5, title: 'Pin Dự Phòng', artist: 'Dương Domic, Lou Hoàng ★', imageUrl: 'assets/images/song5.jpg' },
      { id: 6, title: 'Là Ngang Trời', artist: 'Hồ Nhì, A Tuân', imageUrl: 'assets/images/song6.jpg' },
      { id: 7, title: 'Còn Gì Đẹp Hơn', artist: 'Nguyễn Hùng', imageUrl: 'assets/images/song7.jpg' },
      { id: 8, title: 'Muốn Cua Anh Làm Bỏ', artist: 'Dương Ái Vy, HTM', imageUrl: 'assets/images/song8.jpg' },
      { id: 9, title: 'Thiệp Hồng Sai Tên', artist: 'Nguyễn Thành Đạt', imageUrl: 'assets/images/song9.jpg' }
    ];
    this.updateDisplaySongs();
  }

  // Chia mảng thành các nhóm 3 bài cho mobile slide
  getSongGroups(): Song[][] {
    const groups: Song[][] = [];
    for (let i = 0; i < this.displaySongs.length; i += 3) {
      groups.push(this.displaySongs.slice(i, i + 3));
    }
    return groups;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HeaderComponent} from "../components/header/header.component";
import {IonicModule} from "@ionic/angular";
import { SongItemPage } from "../components/song-item/song-item.page";
import { Music } from '../models/music.model';
import { MusicService } from '../services/music.service';
import {PlayerBarComponent} from "../components/player-bar/player-bar.component";


@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonicModule, SongItemPage, PlayerBarComponent]
})
export class LibraryPage implements OnInit {

  allSongs: Music[] = [];
  isDesktop: boolean = false;
  isTablet: boolean = false;
  isMobile: boolean = false;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private musicService: MusicService) {}

  ngOnInit() {
    this.allSongs = this.musicService.getMusicList();
    this.checkScreenSize();

    // Lắng nghe thay đổi để cập nhật UI
    this.musicService.currentMusic$.subscribe(() => {
      this.allSongs = [...this.allSongs];
    });

    this.musicService.isPlaying$.subscribe(() => {
      this.allSongs = [...this.allSongs];
    });
  }

  checkScreenSize() {
    const width = window.innerWidth;
    this.isMobile = width < 768;
    this.isTablet = width >= 768 && width < 1024;
    this.isDesktop = width >= 1024;
  }

  onResize() {
    this.checkScreenSize();
  }

  // Chia mảng thành các nhóm cho mobile slider (mỗi nhóm 3 bài)
  getSongGroups(): Music[][] {
    const groups: Music[][] = [];
    for (let i = 0; i < this.allSongs.length; i += 3) {
      groups.push(this.allSongs.slice(i, i + 3));
    }
    return groups;
  }
}

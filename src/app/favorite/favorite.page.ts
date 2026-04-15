import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HeaderComponent} from "../components/header/header.component";
import {IonicModule} from "@ionic/angular";
import { SongItemPage } from '../components/song-item/song-item.page';
import { Music } from '../models/music.model';
import { MusicService } from '../services/music.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonicModule, SongItemPage]
})
export class FavoritePage implements OnInit, OnDestroy {

  favoriteSongs: Music[] = [];
  favoriteCount: number = 0;
  isDesktop: boolean = false;
  isTablet: boolean = false;
  isMobile: boolean = false;

  private subscriptions: Subscription = new Subscription();

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private musicService: MusicService) {}

  ngOnInit() {
    this.loadFavorites();
    this.checkScreenSize();

    // Lắng nghe thay đổi để cập nhật UI khi có bài được thêm/xóa
    this.subscriptions.add(
      this.musicService.currentMusic$.subscribe(() => {
        this.loadFavorites();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadFavorites() {
    this.favoriteSongs = this.musicService.getFavoritesList();
    this.favoriteCount = this.favoriteSongs.length;
  }

  playRandom() {
    if (this.favoriteCount === 0) return;
    this.musicService.playRandomFromFavorites();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const width = window.innerWidth;
    this.isMobile = width < 768;
    this.isTablet = width >= 768 && width < 1024;
    this.isDesktop = width >= 1024;
  }
}

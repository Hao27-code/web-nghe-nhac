import {Component, HostListener, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HeaderComponent} from "../components/header/header.component";
import {IonicModule} from "@ionic/angular";
import { SongItemPage } from "../components/song-item/song-item.page";
import { Music } from '../models/music.model';
import { MusicService } from '../services/music.service';
import {PlayerBarComponent} from "../components/player-bar/player-bar.component";
import { LibrarySongItemComponent } from '../components/library-song-item/library-song-item.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonicModule, SongItemPage, PlayerBarComponent,LibrarySongItemComponent]
})
export class LibraryPage implements OnInit {

  favoriteSongs: Music[] = [];
  favoriteCount: number = 0;
  isMobile: boolean = false;  // ← Thêm dòng này
  isTablet: boolean = false;   // ← Thêm nếu cần
  isDesktop: boolean = false;  // ← Thêm nếu cần

  private subscription: Subscription = new Subscription();

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private musicService: MusicService) {}

  ngOnInit() {
    this.loadFavorites();
    this.checkScreenSize();

    // Lắng nghe khi có thay đổi yêu thích
    this.subscription.add(
      this.musicService.currentMusic$.subscribe(() => {
        this.loadFavorites();
      })
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
  loadFavorites() {
    this.favoriteSongs = this.musicService.getFavoritesList();
    this.favoriteCount = this.favoriteSongs.length;
  }

  checkScreenSize() {
    const width = window.innerWidth;
    this.isMobile = width < 768;
    this.isTablet = width >= 768 && width < 1024;
    this.isDesktop = width >= 1024;
  }

  removeSong(songId: number): void {
    this.favoriteSongs = this.favoriteSongs.filter(
      (s: Music) => s.id !== songId
    );
  }
}

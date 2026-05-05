import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonTitle } from '@ionic/angular/standalone';
import {Playlist, PlaylistCardComponent} from "../components/playlist-card/playlist-card.component";
import {PlaylistSliderComponent} from "../components/playlist-slider/playlist-slider.component";
import {HeaderComponent} from "../components/header/header.component";
import {IonicModule} from "@ionic/angular";
import {PlayerBarComponent} from "../components/player-bar/player-bar.component";
import {MusicService} from "../services/music.service";
import { SkeletonLoaderComponent } from '../components/skeleton-loader/skeleton-loader.component';
import { LoadingService } from '../services/loading.service';
import { ScrollAnimationService } from '../services/scroll-animation.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: true,
  imports: [
    IonTitle, CommonModule, FormsModule, PlaylistSliderComponent,
    PlaylistCardComponent, HeaderComponent, IonicModule, PlayerBarComponent,
    SkeletonLoaderComponent  // ✅ Import skeleton
  ]
})
export class CategoryPage implements OnInit {

  private musicService = inject(MusicService);
  private loadingService = inject(LoadingService);
  private scrollAnimation = inject(ScrollAnimationService);
  private router = inject(Router);

  categoryPlaylistsTop100: Playlist[] = [];
  categoryPlaylists: Playlist[] = [];
  isLoading: boolean = true;  // ✅ Thêm biến loading

  private routerSubscription: Subscription | null = null;

  ngOnInit() {
    // Lắng nghe router để reload khi quay lại trang
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/category') {
        console.log('Quay lại trang Category - reload');
        this.reloadData();
      }
    });

    this.loadCategoryPlaylists();
  }

  loadCategoryPlaylists() {
    // Hiển thị skeleton
    this.isLoading = true;
    this.loadingService.showLoading();

    // Reset dữ liệu cũ
    this.categoryPlaylistsTop100 = [];
    this.categoryPlaylists = [];
    this.resetAnimations();

    // Giả lập loading
    setTimeout(() => {
      const allSongs = this.musicService.getMusicList();

      // Dữ liệu Top 100
      this.categoryPlaylistsTop100 = [
        { id: 1, title: 'cuối cùng thì mình cũng chia ly', artists: 'Jack - J97, DatKaa...', imageUrl: 'assets/img/theloai_chill.jpg', songs: [allSongs[0], allSongs[1], allSongs[2]] },
        { id: 2, title: 'đã từng xem nhau là tất cả', artists: 'Quân A.P, thao linh...', imageUrl: 'assets/img/theloai_chill1.jpg', songs: [allSongs[2], allSongs[3], allSongs[4]] },
        { id: 3, title: 'nếu duyên', artists: 'Thành Đạt, Lê Bảo Bình...', imageUrl: 'assets/img/theloai_chill2.jpg', songs: [allSongs[4], allSongs[5], allSongs[6]] },
        { id: 4, title: 'người thứ ba', artists: 'Văn Mai Hương, Quân A.P...', imageUrl: 'assets/img/theloai_chill3.jpg', songs: [allSongs[6], allSongs[7], allSongs[8]] },
        { id: 5, title: 'Song Ca V-Pop', artists: 'GREY D, MIN★...', imageUrl: 'assets/img/theloai_chill4.jpg', songs: [allSongs[8], allSongs[9], allSongs[10]] },
        { id: 6, title: 'Nhạc Trẻ Hay Nhất', artists: 'Sơn Tùng M-TP...', imageUrl: 'assets/img/theloai_chill5.jpg', songs: [allSongs[0], allSongs[2], allSongs[4]] },
        { id: 7, title: 'Nhạc Trẻ Hay Nhất', artists: 'Sơn Tùng M-TP...', imageUrl: 'assets/img/theloai_chill5.jpg', songs: [allSongs[1], allSongs[3], allSongs[5]] }
      ];

      // Dữ liệu Chill
      this.categoryPlaylists = [
        { id: 100, title: 'Top 100 Nhạc V-Pop Hay Nhất', artists: 'Dương Domic...', imageUrl: 'assets/img/top100_1.jpg', songs: [allSongs[0], allSongs[1], allSongs[2], allSongs[3], allSongs[4]] },
        { id: 101, title: 'Top 100 Pop Âu Mỹ Hay Nhất', artists: 'Taylor Swift...', imageUrl: 'assets/img/top100_2.jpg', songs: [allSongs[2], allSongs[3], allSongs[4], allSongs[5], allSongs[6]] },
        { id: 102, title: 'Top 100 Nhạc', artists: 'Alan Walker...', imageUrl: 'assets/img/top100_3.jpg', songs: [allSongs[4], allSongs[5], allSongs[6], allSongs[7], allSongs[8]] },
        { id: 103, title: 'Top 100 Nhạc Rap Việt Nam', artists: 'HIEUTHUHAI...', imageUrl: 'assets/img/top100_4.jpg', songs: [allSongs[6], allSongs[7], allSongs[8], allSongs[9], allSongs[10]] },
        { id: 104, title: 'Top 100 Nhạc Hàn Quốc Hay', artists: 'BABYMONSTER...', imageUrl: 'assets/img/top100_5.jpg', songs: [allSongs[0], allSongs[2], allSongs[4], allSongs[6], allSongs[8]] },
        { id: 105, title: 'Top 100 Nhạc Phim Việt Nam', artists: 'ERIK...', imageUrl: 'assets/img/top100_6.jpg', songs: [allSongs[1], allSongs[3], allSongs[5], allSongs[7], allSongs[9]] }
      ];

      // Tắt skeleton
      this.isLoading = false;
      this.loadingService.hideLoading();

      // Khởi tạo animation
      setTimeout(() => {
        this.initScrollAnimations();
        this.initStaggerAnimation();
      }, 100);
    }, 800);
  }

  reloadData() {
    this.isLoading = true;
    this.loadingService.showLoading();
    this.resetAnimations();
    this.loadCategoryPlaylists();
  }

  initScrollAnimations() {
    const elements = ['app-playlist-slider'];
    elements.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add('reveal-on-scroll');
      });
    });
    this.scrollAnimation.initScrollAnimations();
  }

  initStaggerAnimation() {
    const sliders = document.querySelectorAll('app-playlist-slider');
    sliders.forEach((item, index) => {
      (item as HTMLElement).style.setProperty('--slider-index', index.toString());
    });
  }

  resetAnimations() {
    const revealedElements = document.querySelectorAll('.revealed, .reveal-on-scroll');
    revealedElements.forEach(el => {
      el.classList.remove('revealed', 'reveal-on-scroll');
    });

    const sliders = document.querySelectorAll('app-playlist-slider');
    sliders.forEach(item => {
      (item as HTMLElement).style.removeProperty('--slider-index');
    });
  }

  @HostListener('window:resize')
  onResize() {
    // Xử lý resize nếu cần
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    this.scrollAnimation.disconnect();
  }
}

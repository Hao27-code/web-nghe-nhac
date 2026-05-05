import {Component, HostListener, OnDestroy, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HeaderComponent} from "../components/header/header.component";
import {IonicModule} from "@ionic/angular";
import { SongItemPage } from '../components/song-item/song-item.page';
import { Music } from '../models/music.model';
import { MusicService } from '../services/music.service';
import { Subscription } from 'rxjs';
import {LibrarySongItemComponent} from "../components/library-song-item/library-song-item.component";
import {PlayerBarComponent} from "../components/player-bar/player-bar.component";
import { SkeletonLoaderComponent } from '../components/skeleton-loader/skeleton-loader.component';
import { LoadingService } from '../services/loading.service';
import { ScrollAnimationService } from '../services/scroll-animation.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, HeaderComponent, IonicModule,
    SongItemPage, LibrarySongItemComponent, PlayerBarComponent,
    SkeletonLoaderComponent
  ]
})
export class FavoritePage implements OnInit, OnDestroy {

  private musicService = inject(MusicService);
  private loadingService = inject(LoadingService);
  private scrollAnimation = inject(ScrollAnimationService);
  private router = inject(Router);

  favoriteSongs: Music[] = [];
  favoriteCount: number = 0;
  isDesktop: boolean = false;
  isTablet: boolean = false;
  isMobile: boolean = false;
  isLoading: boolean = true;

  private subscriptions: Subscription = new Subscription();
  private routerSubscription: Subscription | null = null;
  private isFirstLoad: boolean = true; // ✅ Thêm flag

  ngOnInit() {
    this.checkScreenSize();

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/favorite' && !this.isFirstLoad) {
        console.log('Quay lại trang yêu thích - reload');
        this.reloadData();
      }
      this.isFirstLoad = false;
    });

    this.subscriptions.add(
      this.musicService.favorites$.subscribe(favorites => {
        this.favoriteSongs = favorites;
        this.favoriteCount = favorites.length;

        setTimeout(() => {
          this.isLoading = false;
          this.loadingService.hideLoading();
          this.initScrollAnimations();
          this.initStaggerAnimation();
        }, 500);
      })
    );
  }

  reloadData(): void {
    this.isLoading = true;
    this.loadingService.showLoading();

    setTimeout(() => {
      this.isLoading = false;
      this.loadingService.hideLoading();

      // ✅ Đợi DOM render xong mới gọi animation
      setTimeout(() => {
        this.initScrollAnimations();
        this.initStaggerAnimation();
      }, 100);
    }, 500);
  }

  // ✅ KHÔNG xóa class cũ, chỉ thêm mới
  initScrollAnimations() {
    const elements = [
      '.playlist-header',
      '.playlist-actions',
      '.songs-section',
      'app-library-song-item'
    ];

    elements.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        // ✅ Chỉ thêm nếu chưa có class
        if (!el.classList.contains('reveal-on-scroll')) {
          el.classList.add('reveal-on-scroll');
        }
      });
    });
    this.scrollAnimation.initScrollAnimations();
  }

  initStaggerAnimation() {
    const songItems = document.querySelectorAll('app-library-song-item');
    songItems.forEach((item, index) => {
      (item as HTMLElement).style.setProperty('--song-index', index.toString());
    });
  }

  // ✅ Xóa resetAnimations - không cần thiết
  // resetAnimations() { ... } // XÓA HOẶC COMMENT

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    this.scrollAnimation.disconnect();
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

  trackById(index: number, item: Music) {
    return item.id;
  }
}

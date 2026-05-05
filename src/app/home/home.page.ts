import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HeaderComponent} from "../components/header/header.component";
import {IonicModule} from "@ionic/angular";
import {NgClass, NgOptimizedImage} from "@angular/common";
import { CommonModule } from '@angular/common';
import { AfterViewInit, OnDestroy, HostListener, inject } from '@angular/core';
import { addIcons } from 'ionicons';
import {chevronBackOutline, chevronForwardOutline} from 'ionicons/icons';
import { play, informationCircle } from 'ionicons/icons';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {PlayerBarComponent} from "../components/player-bar/player-bar.component";
import {MusicCardComponent} from "../components/music-card/music-card.component";
import { MusicService } from '../services/music.service';
import { Music } from '../models/music.model';
import { Subscription } from 'rxjs';
import { SongListPage } from '../components/song-list/song-list.page';
import {Playlist, PlaylistCardComponent} from "../components/playlist-card/playlist-card.component";
import {PlaylistSliderComponent} from "../components/playlist-slider/playlist-slider.component";


interface Slide {
  id: number;
  image: string;
  mobileImage?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [HeaderComponent, IonicModule, NgClass, NgOptimizedImage, CommonModule, PlayerBarComponent, MusicCardComponent, SongListPage, PlaylistCardComponent, PlaylistSliderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('sliderViewport') sliderViewport!: ElementRef<HTMLDivElement>;
  @ViewChild('sliderTrack') sliderTrack!: ElementRef<HTMLDivElement>;
  @ViewChild('resumeScroll') resumeScroll!: ElementRef;
  @ViewChild('forYouScroll') forYouScroll!: ElementRef;

  // Scroll reveal observer
  private scrollObserver: IntersectionObserver | null = null;

  greeting = '';
  private musicService = inject(MusicService);
  musicList: Music[] = [];
  recentlyPlayed: Music[] = [];
  private subscriptions: Subscription = new Subscription();

  // Slides data
  desktopSlides: Slide[] = [
    { id: 1, image: 'assets/img/banner_1.webp'},
    { id: 2, image: 'assets/img/banner_2.webp'},
    { id: 3, image: 'assets/img/banner_3.webp'},
    { id: 4, image: 'assets/img/banner_4.webp'},
    { id: 5, image: 'assets/img/banner_5.webp'}
  ];
  mobileSlides: Slide[] = [
    { id: 1, image: 'assets/img/banner_1_mb.jpg' },
    { id: 2, image: 'assets/img/banner_2_mb.jpg' },
    { id: 3, image: 'assets/img/banner_3_mb.jpg' }
  ];
  slides: Slide[] = [];

  // Slider variables
  currentIndex: number = 0;
  currentTranslate: number = 0;
  isDragging: boolean = false;
  startX: number = 0;
  startY: number = 0;
  currentX: number = 0;
  autoPlayInterval: any;
  slideWidth: number = 0;
  totalSlides: number = 0;
  dragThreshold: number = 50;
  realIndex: number = 0;
  slidesPerView: number = 2;
  originalSlides: Slide[] = [];
  isMobile = window.innerWidth <= 991;
  dragDirection: 'horizontal' | 'vertical' | 'unknown' = 'unknown';

  loopPlaylists: any[] = [];
  icons = {
    play,
    informationCircle
  };

  homePlaylists: Playlist[] = [];
  homePlayliststop100: Playlist[] = [];

  updateSlidesPerView() {
    if (window.innerWidth <= 991) {
      this.slidesPerView = 1;
    } else {
      this.slidesPerView = 2;
    }
  }

  constructor() {
    this.isMobile = window.innerWidth <= 991;
    this.updateSlidesPerView();
    this.originalSlides = this.isMobile ? this.mobileSlides : this.desktopSlides;
    this.initInfiniteSlides();

    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'chevron-forward-outline': chevronForwardOutline
    });
  }

  ngOnInit() {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = 'Chào buổi sáng';
    } else if (hour < 18) {
      this.greeting = 'Chào buổi chiều';
    } else {
      this.greeting = 'Chào buổi tối';
    }

    this.musicList = this.musicService.getMusicList();
    this.subscriptions.add(
      this.musicService.recentlyPlayed$.subscribe(recently => {
        this.recentlyPlayed = recently;
        setTimeout(() => this.setupCardDelays(), 100);
      })
    );
    this.loadPlaylistsWithSongs();
  }

  ngAfterViewInit() {
    // Khởi tạo slider
    setTimeout(() => {
      this.updateSlideWidth();
      this.updateTranslate();
      this.currentIndex = this.slidesPerView;
      this.updateTranslateWithoutTransition();
    });
    this.startAutoPlay();

    // ==================== KHỞI TẠO SCROLL REVEAL ====================
    this.initScrollReveal();

    // ==================== ANIMATION BAN ĐẦU ====================
    this.initInitialAnimations();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
  }

  // ==================== SCROLL REVEAL - CHẬM VÀ MƯỢT ====================

  private initScrollReveal() {
    const revealSelectors = [
      '.album-section',
      '.section-header-list-song',
      'app-song-list',
      '.music-section.resume-section',
      '.music-section:not(.resume-section)',
      'app-playlist-slider'
    ];

    revealSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add('reveal-on-scroll');
      });
    });

    // ✅ QUAN TRỌNG: KHÔNG dùng unobserve, để observer tiếp tục theo dõi
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Thêm class revealed khi vào viewport
          entry.target.classList.add('revealed');
        } else {
          // ✅ THÊM: Xóa class revealed khi ra khỏi viewport
          entry.target.classList.remove('revealed');
        }
      });
    }, {
      threshold: 0.15,  // 15% phần tử hiện ra mới kích hoạt
      rootMargin: '0px 0px -50px 0px'
      // ❌ KHÔNG dùng rootMargin âm quá lớn
    });

    // Quan sát tất cả - KHÔNG bỏ observe
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      this.scrollObserver?.observe(el);
    });
  }

  private initInitialAnimations() {
    // Greeting - animation ngay khi load
    const greetingEl = document.querySelector('.greeting');
    if (greetingEl) {
      greetingEl.classList.add('fade-down');
    }

    // Slider - animation ngay khi load
    const sliderEl = document.querySelector('.custom-slider-container');
    if (sliderEl) {
      sliderEl.classList.add('fade-up');
    }

    // Album card - scale in
    const albumCard = document.querySelector('.album-card');
    if (albumCard) {
      albumCard.classList.add('scale-in');
    }
  }

  private setupCardDelays() {
    // Resume section cards
    const resumeCards = document.querySelectorAll('.resume-scroll app-music-card');
    resumeCards.forEach((card, index) => {
      (card as HTMLElement).style.setProperty('--card-index', index.toString());
    });

    // For you section cards
    const forYouCards = document.querySelectorAll('.music-section:not(.resume-section) .music-horizontal-scroll app-music-card');
    forYouCards.forEach((card, index) => {
      (card as HTMLElement).style.setProperty('--card-index', index.toString());
    });
  }

  // ==================== SCROLL FUNCTIONS ====================

  scrollLeft(scrollId: string) {
    let scrollElement: HTMLElement | null = null;
    if (scrollId === 'resumeScroll') {
      scrollElement = this.resumeScroll?.nativeElement;
    } else if (scrollId === 'forYouScroll') {
      scrollElement = this.forYouScroll?.nativeElement;
    }
    if (scrollElement) {
      scrollElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(scrollId: string) {
    let scrollElement: HTMLElement | null = null;
    if (scrollId === 'resumeScroll') {
      scrollElement = this.resumeScroll?.nativeElement;
    } else if (scrollId === 'forYouScroll') {
      scrollElement = this.forYouScroll?.nativeElement;
    }
    if (scrollElement) {
      scrollElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  viewAllRecentlyPlayed() {
    console.log('Xem tất cả bài hát đã nghe');
  }

  viewAllMusic() {
    console.log('Xem tất cả bài hát');
  }

  onPlayMusic(music: Music) {
    this.musicService.playMusic(music);
  }

  isFavorite(music: Music): boolean {
    return this.musicService.isFavorite(music);
  }

  toggleFavorite(music: Music) {
    this.musicService.toggleFavorite(music);
  }

  // ==================== SLIDER FUNCTIONS ====================

  initInfiniteSlides() {
    // Clone số lượng slide bằng slidesPerView
    const cloneCount = this.slidesPerView;
    const cloneFirst = [...this.originalSlides.slice(-cloneCount)];
    const cloneLast = [...this.originalSlides.slice(0, cloneCount)];
    this.slides = [...cloneFirst, ...this.originalSlides, ...cloneLast];
    this.totalSlides = this.slides.length;
    this.currentIndex = cloneCount;
    this.realIndex = 0;
  }

  @HostListener('window:resize')
  onResize() {
    const newIsMobile = window.innerWidth <= 991;
    const oldSlidesPerView = this.slidesPerView;

    // Cập nhật slidesPerView mới
    this.updateSlidesPerView();

    // Nếu có thay đổi giữa mobile và desktop HOẶC slidesPerView thay đổi
    if (newIsMobile !== this.isMobile || oldSlidesPerView !== this.slidesPerView) {
      this.isMobile = newIsMobile;
      this.originalSlides = this.isMobile ? this.mobileSlides : this.desktopSlides;

      // Lưu lại real index hiện tại
      const currentRealIndex = this.realIndex;

      // Re-initialize slides
      this.initInfiniteSlides();

      // Khôi phục lại index
      this.currentIndex = this.slidesPerView + currentRealIndex;

      // Cập nhật width và translate
      setTimeout(() => {
        this.updateSlideWidth();
        this.updateTranslateWithoutTransition();
      }, 100);
    } else {
      // Chỉ cập nhật width
      this.updateSlideWidth();
      this.updateTranslate();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) this.onDragMove(event);
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.onDragEnd();
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.isDragging) this.onDragMove(event);
  }

  @HostListener('document:touchend')
  onTouchEnd() {
    this.onDragEnd();
  }

  updateSlideWidth() {
    // Cập nhật slidesPerView dựa trên kích thước màn hình
    this.updateSlidesPerView();

    const container = this.sliderViewport?.nativeElement;
    if (container) {
      this.slideWidth = container.offsetWidth / this.slidesPerView;
    }
  }

  updateTranslate() {
    if (this.slideWidth) {
      this.currentTranslate = -this.currentIndex * this.slideWidth;
    }
    if (this.sliderTrack) {
      this.sliderTrack.nativeElement.style.transform = `translateX(${this.currentTranslate}px)`;
    }
  }

  updateTranslateWithoutTransition() {
    this.setTransition(false);
    this.updateTranslate();
    setTimeout(() => this.setTransition(true), 50);
  }

  updateRealIndex() {
    this.realIndex = this.currentIndex - this.slidesPerView;
    if (this.realIndex < 0) {
      this.realIndex += this.originalSlides.length;
    } else if (this.realIndex >= this.originalSlides.length) {
      this.realIndex -= this.originalSlides.length;
    }
  }

  fixInfiniteLoop() {
    const cloneCount = this.slidesPerView;
    const lastCloneStart = this.totalSlides - cloneCount;
    if (this.currentIndex >= lastCloneStart) {
      this.currentIndex = cloneCount + (this.currentIndex - lastCloneStart);
      this.updateTranslateWithoutTransition();
      this.updateRealIndex();
    } else if (this.currentIndex < cloneCount) {
      this.currentIndex = lastCloneStart - (cloneCount - this.currentIndex);
      this.updateTranslateWithoutTransition();
      this.updateRealIndex();
    } else {
      this.updateRealIndex();
    }
  }

  nextSlide() {
    this.stopAutoPlay();
    this.currentIndex++;
    this.updateTranslate();
    this.fixInfiniteLoop();
    this.startAutoPlay();
  }

  prevSlide() {
    this.stopAutoPlay();
    this.currentIndex--;
    this.updateTranslate();
    this.fixInfiniteLoop();
    this.startAutoPlay();
  }

  goToSlide(index: number) {
    this.stopAutoPlay();
    this.currentIndex = index + this.slidesPerView;
    this.updateTranslate();
    this.fixInfiniteLoop();
    this.startAutoPlay();
  }

  startAutoPlay() {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 4000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
  }

  onDragStart(event: MouseEvent | TouchEvent) {
    this.stopAutoPlay();
    this.isDragging = true;
    this.startX = this.getClientX(event);
    this.startY = this.getClientY(event);
    this.currentX = this.startX;
    this.dragDirection = 'unknown';
    this.setTransition(false);
  }

  onDragMove(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    this.currentX = this.getClientX(event);
    const currentY = this.getClientY(event);
    const diffX = this.currentX - this.startX;
    const diffY = currentY - this.startY;

    if (this.dragDirection === 'unknown' && (Math.abs(diffX) > 5 || Math.abs(diffY) > 5)) {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        this.dragDirection = 'horizontal';
        if (event instanceof TouchEvent) event.preventDefault();
      } else {
        this.dragDirection = 'vertical';
        this.isDragging = false;
        this.setTransition(true);
        return;
      }
    }

    if (this.dragDirection === 'horizontal') {
      if (event instanceof TouchEvent) event.preventDefault();
      const translate = -this.currentIndex * this.slideWidth + diffX;
      if (this.sliderTrack) {
        this.sliderTrack.nativeElement.style.transform = `translateX(${translate}px)`;
      }
    }
  }

  onDragEnd() {
    if (!this.isDragging) return;
    if (this.dragDirection === 'horizontal') {
      const movedX = this.currentX - this.startX;
      if (Math.abs(movedX) > this.dragThreshold) {
        if (movedX > 0) this.currentIndex--;
        else this.currentIndex++;
        this.updateTranslate();
        this.fixInfiniteLoop();
      } else {
        this.updateTranslate();
      }
    }
    this.isDragging = false;
    this.setTransition(true);
    this.startAutoPlay();
  }

  getClientX(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) return event.clientX;
    return event.touches[0].clientX;
  }

  getClientY(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) return event.clientY;
    return event.touches[0].clientY;
  }

  setTransition(enable: boolean) {
    if (this.sliderTrack) {
      if (enable) {
        this.sliderTrack.nativeElement.style.transition = 'transform 0.3s ease-out';
      } else {
        this.sliderTrack.nativeElement.style.transition = 'none';
      }
    }
  }

  loadPlaylistsWithSongs() {
    const allSongs = this.musicService.getMusicList();
    this.homePlaylists = [
      { id: 1, title: 'cuối cùng thì mình cũng chia ly', artists: 'Jack - J97, DatKaa...', imageUrl: 'assets/img/theloai_chill.jpg', songs: [allSongs[0], allSongs[1], allSongs[2]] },
      { id: 2, title: 'đã từng xem nhau là tất cả', artists: 'Quân A.P, thao linh...', imageUrl: 'assets/img/theloai_chill1.jpg', songs: [allSongs[2], allSongs[3], allSongs[4]] },
      { id: 3, title: 'nếu duyên', artists: 'Thành Đạt, Lê Bảo Bình...', imageUrl: 'assets/img/theloai_chill2.jpg', songs: [allSongs[4], allSongs[5], allSongs[6]] },
      { id: 4, title: 'người thứ ba', artists: 'Văn Mai Hương, Quân A.P...', imageUrl: 'assets/img/theloai_chill3.jpg', songs: [allSongs[6], allSongs[7], allSongs[8]] },
      { id: 5, title: 'Song Ca V-Pop', artists: 'GREY D, MIN★...', imageUrl: 'assets/img/theloai_chill4.jpg', songs: [allSongs[8], allSongs[9], allSongs[10]] },
      { id: 6, title: 'Nhạc Trẻ Hay Nhất', artists: 'Sơn Tùng M-TP...', imageUrl: 'assets/img/theloai_chill5.jpg', songs: [allSongs[0], allSongs[2], allSongs[4]] },
      { id: 7, title: 'Nhạc Trẻ Hay Nhất', artists: 'Sơn Tùng M-TP...', imageUrl: 'assets/img/theloai_chill5.jpg', songs: [allSongs[1], allSongs[3], allSongs[5]] }
    ];
    this.homePlayliststop100 = [
      { id: 100, title: 'Top 100 Nhạc V-Pop Hay Nhất', artists: 'Dương Domic...', imageUrl: 'assets/img/top100_1.jpg', songs: [allSongs[0], allSongs[1], allSongs[2], allSongs[3], allSongs[4]] },
      { id: 101, title: 'Top 100 Pop Âu Mỹ Hay Nhất', artists: 'Taylor Swift...', imageUrl: 'assets/img/top100_2.jpg', songs: [allSongs[2], allSongs[3], allSongs[4], allSongs[5], allSongs[6]] },
      { id: 102, title: 'Top 100 Nhạc', artists: 'Alan Walker...', imageUrl: 'assets/img/top100_3.jpg', songs: [allSongs[4], allSongs[5], allSongs[6], allSongs[7], allSongs[8]] },
      { id: 103, title: 'Top 100 Nhạc Rap Việt Nam', artists: 'HIEUTHUHAI...', imageUrl: 'assets/img/top100_4.jpg', songs: [allSongs[6], allSongs[7], allSongs[8], allSongs[9], allSongs[10]] },
      { id: 104, title: 'Top 100 Nhạc Hàn Quốc Hay', artists: 'BABYMONSTER...', imageUrl: 'assets/img/top100_5.jpg', songs: [allSongs[0], allSongs[2], allSongs[4], allSongs[6], allSongs[8]] },
      { id: 105, title: 'Top 100 Nhạc Phim Việt Nam', artists: 'ERIK...', imageUrl: 'assets/img/top100_6.jpg', songs: [allSongs[1], allSongs[3], allSongs[5], allSongs[7], allSongs[9]] }
    ];
  }
}

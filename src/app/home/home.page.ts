import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HeaderComponent} from "../components/header/header.component";
import {IonicModule} from "@ionic/angular";
import {NgClass, NgOptimizedImage} from "@angular/common";
import { CommonModule } from '@angular/common';
import { AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { addIcons } from 'ionicons';
import {chevronBackOutline, chevronForwardOutline} from 'ionicons/icons';
import { play, informationCircle } from 'ionicons/icons';
import {ContinueListeningComponent} from "../components/continue-listening/continue-listening.component";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


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
  imports: [HeaderComponent, IonicModule, NgClass, NgOptimizedImage, CommonModule, ContinueListeningComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sliderViewport') sliderViewport!: ElementRef<HTMLDivElement>;
  @ViewChild('sliderTrack') sliderTrack!: ElementRef<HTMLDivElement>;

  greeting='';
  ngOnInit() {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting='Chào buổi sáng';
    }else if(hour < 18){
      this.greeting='Chào buổi chiều'
    }else {
      this.greeting='Chào buổi tối'
    }
  }
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
  // Slides đã được nhân bản để tạo infinite loop
  slides: Slide[] = [];

  //phát nhạc
  audio = new Audio();
  currentSong: any = null;
  playSong(song: any) {
    this.currentSong = song;

    this.audio.src = song.src;
    this.audio.currentTime = 0;
    this.audio.play();

    this.saveHistory();
  }
  saveHistory() {
    let lastSave = 0;

    this.audio.ontimeupdate = () => {
      if (!this.currentSong) return;

      // tránh spam
      if (Date.now() - lastSave < 1000) return;
      lastSave = Date.now();

      // lấy list cũ (mảng)
      let list = JSON.parse(localStorage.getItem('continueList') || '[]');

      // xóa nếu trùng bài
      list = list.filter((item: any) => item.src !== this.currentSong.src);

      // thêm bài mới lên đầu
      list.unshift({
        title: this.currentSong.title,
        artist: this.currentSong.artist,
        image: this.currentSong.image,
        src: this.currentSong.src,
        currentTime: this.audio.currentTime,
        duration: this.audio.duration
      });

      // giới hạn 5 bài
      list = list.slice(0, 5);

      // lưu lại
      localStorage.setItem('continueList', JSON.stringify(list));
    };
  }

  currentIndex: number = 0;
  currentTranslate: number = 0;
  isDragging: boolean = false;
  startX: number = 0;
  currentX: number = 0;
  autoPlayInterval: any;
  slideWidth: number = 0;
  totalSlides: number = 0;
  dragThreshold: number = 50;
  realIndex: number = 0;
  slidesPerView: number = 2; // Hiển thị 2 ảnh cùng lúc
  originalSlides: Slide[] = [];
  isMobile = window.innerWidth <= 991;

  loopPlaylists: any[] = []; // Dữ liệu playlist của bạn
  icons = {
    play,
    informationCircle
  };
  constructor() {
    this.isMobile = window.innerWidth <= 991;

    this.originalSlides = this.isMobile
      ? this.mobileSlides
      : this.desktopSlides;

    this.initInfiniteSlides();

    addIcons({
      chevronBackOutline,
      chevronForwardOutline
    });
  }

  initInfiniteSlides() {
    // Clone slides để tạo infinite loop
    const cloneCount = this.slidesPerView;
    const cloneFirst = [...this.originalSlides.slice(-cloneCount)];
    const cloneLast = [...this.originalSlides.slice(0, cloneCount)];
    this.slides = [...cloneFirst, ...this.originalSlides, ...cloneLast];
    this.totalSlides = this.slides.length;
    this.currentIndex = cloneCount;
    this.realIndex = 0;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateSlideWidth();
      this.updateTranslate();
      this.currentIndex = this.slidesPerView;
      this.updateTranslateWithoutTransition();
    });
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  @HostListener('window:resize')
  onResize() {
    const newIsMobile = window.innerWidth <= 991;

    if (newIsMobile !== this.isMobile) {
      this.isMobile = newIsMobile;

      this.originalSlides = this.isMobile
        ? this.mobileSlides
        : this.desktopSlides;

      this.initInfiniteSlides(); // reload lại slider
    }

    this.updateSlideWidth();
    this.updateTranslate();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.onDragMove(event);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.onDragEnd();
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.isDragging) {
      this.onDragMove(event);
    }
  }

  @HostListener('document:touchend')
  onTouchEnd() {
    this.onDragEnd();
  }

  updateSlideWidth() {
    if (window.innerWidth <= 991) {
      this.slidesPerView = 1; // 🔥 mobile = 1 ảnh
    } else {
      this.slidesPerView = 2; // desktop = 2 ảnh
    }

    const container = this.sliderViewport?.nativeElement;
    if (container) {
      this.slideWidth = container.offsetWidth / this.slidesPerView;
    }
  }

  updateTranslate() {
    if (this.slideWidth) {
      this.currentTranslate = -this.currentIndex * this.slideWidth;
    }
  }

  updateTranslateWithoutTransition() {
    this.setTransition(false);
    this.updateTranslate();
    setTimeout(() => {
      this.setTransition(true);
    }, 50);
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
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  onDragStart(event: MouseEvent | TouchEvent) {
    this.stopAutoPlay();
    this.isDragging = true;
    this.startX = this.getClientX(event);
    this.currentX = this.startX;
    this.setTransition(false);
  }

  onDragMove(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    this.currentX = this.getClientX(event);
    const diff = this.currentX - this.startX;
    const newTranslate = -this.currentIndex * this.slideWidth + diff;
    this.currentTranslate = newTranslate;
  }

  onDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    const movedX = this.currentX - this.startX;

    if (Math.abs(movedX) > this.dragThreshold) {
      if (movedX > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex++;
      }
      this.updateTranslate();
      this.fixInfiniteLoop();
    } else {
      this.updateTranslate();
    }

    this.setTransition(true);
    this.startAutoPlay();
  }

  getClientX(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) {
      return event.clientX;
    } else {
      return event.touches[0].clientX;
    }
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
}



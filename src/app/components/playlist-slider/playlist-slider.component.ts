import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {Playlist, PlaylistCardComponent} from '../playlist-card/playlist-card.component';
import {IonicModule} from "@ionic/angular";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MusicService} from "../../services/music.service";

@Component({
  selector: 'app-playlist-slider',
  standalone: true,
  templateUrl: './playlist-slider.component.html',
  styleUrls: ['./playlist-slider.component.scss'],
  imports: [
    IonicModule,
    PlaylistCardComponent,
    RouterModule,
    CommonModule
  ]
})
export class PlaylistSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() playlists: Playlist[] = [];
  @Input() title: string = 'Gợi ý Playlist';
  @Input() categoryRoute: string = '/category';
  @Input() categoryId: string = '';

  @ViewChild('sliderTrack') sliderTrack!: ElementRef;

  currentIndex: number = 0;
  slidesToShow: number = 1;
  totalSlides: number = 0;

  // Touch events
  touchStartX: number = 0;
  touchEndX: number = 0;
  isDragging: boolean = false;
  startTranslate: number = 0;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private musicService: MusicService) {}

  ngOnInit() {
    this.updateSlidesToShow();
  }

  ngAfterViewInit() {
    this.totalSlides = this.playlists.length;
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
    this.updateSlidesToShow();
  }

  updateSlidesToShow() {
    const width = window.innerWidth;
    if (width >= 1200) {
      this.slidesToShow = 4;
    } else if (width >= 992) {
      this.slidesToShow = 3;
    } else if (width >= 576) {
      this.slidesToShow = 2;
    } else {
      this.slidesToShow = 1;
    }
    this.currentIndex = 0;
  }

  // Touch events cho mobile - THÊM THAM SỐ event
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.isDragging = true;
    this.startTranslate = this.getCurrentTranslate();
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    this.touchEndX = event.touches[0].clientX;
    const diff = this.touchEndX - this.touchStartX;
    const track = this.sliderTrack.nativeElement;
    const newTranslate = this.startTranslate + diff;
    track.style.transform = `translateX(${newTranslate}px)`;
  }

  // SỬA: Thêm tham số event (có thể dùng hoặc không)
  onTouchEnd(event?: TouchEvent) {  // Thêm ? để optional
    this.isDragging = false;
    const diff = this.touchEndX - this.touchStartX;
    const threshold = 50;

    if (diff > threshold && this.currentIndex > 0) {
      this.prevSlide();
    } else if (diff < -threshold && this.currentIndex + this.slidesToShow < this.totalSlides) {
      this.nextSlide();
    } else {
      this.resetPosition();
    }

    // Reset values
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  getCurrentTranslate(): number {
    const track = this.sliderTrack.nativeElement;
    const transform = track.style.transform;
    if (transform && transform !== 'none') {
      const match = transform.match(/translateX\((-?\d+)px\)/);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    return 0;
  }

  resetPosition() {
    const cardWidth = 210;
    const gap = 16;
    const translateX = this.currentIndex * (cardWidth + gap);
    const track = this.sliderTrack.nativeElement;
    track.style.transform = `translateX(-${translateX}px)`;
  }

  nextSlide() {
    if (this.currentIndex + this.slidesToShow < this.totalSlides) {
      this.currentIndex++;
      const cardWidth = 210;
      const gap = 16;
      const translateX = this.currentIndex * (cardWidth + gap);
      const track = this.sliderTrack.nativeElement;
      track.style.transform = `translateX(-${translateX}px)`;
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const cardWidth = 210;
      const gap = 16;
      const translateX = this.currentIndex * (cardWidth + gap);
      const track = this.sliderTrack.nativeElement;
      track.style.transform = `translateX(-${translateX}px)`;
    }
  }

  goToCategory() {
    console.log('Go to category:', this.categoryRoute);
  }

  onPlayClick(playlist: Playlist) {
    console.log('Play playlist:', playlist.title);

    if (playlist.songs && playlist.songs.length > 0) {
      const firstSong = playlist.songs[0];
      const savedTime = this.musicService.getSavedTime(firstSong.id);
      this.musicService.playMusic(firstSong, savedTime);
    }
  }

}

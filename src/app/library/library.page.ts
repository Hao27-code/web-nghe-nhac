import {Component, HostListener, OnInit, AfterViewInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HeaderComponent} from "../components/header/header.component";
import {IonicModule} from "@ionic/angular";
import { SongItemPage } from "../components/song-item/song-item.page";
import { Music } from '../models/music.model';
import { MusicService } from '../services/music.service';
import {PlayerBarComponent} from "../components/player-bar/player-bar.component";
import { LibrarySongItemComponent } from '../components/library-song-item/library-song-item.component';
import { LoadingService } from '../services/loading.service';
import { ScrollAnimationService } from '../services/scroll-animation.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SkeletonLoaderComponent } from '../components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonicModule, SongItemPage, PlayerBarComponent, LibrarySongItemComponent, SkeletonLoaderComponent]
})
export class LibraryPage implements OnInit, AfterViewInit {

  private musicService = inject(MusicService);
  private loadingService = inject(LoadingService);
  private scrollAnimation = inject(ScrollAnimationService);
  private router = inject(Router);

  allSongs: Music[] = [];
  isMobile: boolean = false;
  isTablet: boolean = false;
  isDesktop: boolean = false;
  isLoading: boolean = true;  // ✅ Thêm biến loading

  private scrollObserver: IntersectionObserver | null = null;
  private routerSubscription: Subscription | null = null;

  ngOnInit() {
    this.checkScreenSize();

    // Lắng nghe router để reload khi quay lại
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/library') {
        this.reloadData();
      }
    });

    this.loadData();
  }

  // ✅ Thêm method loadData
  loadData() {
    this.isLoading = true;
    this.allSongs = [];
    this.resetAnimations();

    setTimeout(() => {
      this.allSongs = this.musicService.getMusicList();
      this.isLoading = false;

      setTimeout(() => {
        this.initScrollAnimations();
        this.initStaggerAnimation();
      }, 100);
    }, 800);
  }

  // ✅ Thêm method reloadData
  reloadData() {
    this.isLoading = true;
    this.resetAnimations();
    this.loadData();
  }

  // ✅ Thêm method resetAnimations
  resetAnimations() {
    const revealedElements = document.querySelectorAll('.revealed, .reveal-on-scroll');
    revealedElements.forEach(el => {
      el.classList.remove('revealed', 'reveal-on-scroll');
    });

    const songItems = document.querySelectorAll('app-library-song-item');
    songItems.forEach(item => {
      (item as HTMLElement).style.removeProperty('--song-index');
    });
  }

  ngAfterViewInit() {
    // Không cần setTimeout vì đã có trong loadData
  }

  ngOnDestroy() {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    this.scrollAnimation.disconnect();
  }

  private initScrollAnimations() {
    // Thêm .songs-list vào danh sách cần reveal
    const elements = [
      '.library-header',
      '.table-library',
      '.table-header',
      '.songs-list'  // ✅ QUAN TRỌNG: thêm songs-list
    ];

    elements.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add('reveal-on-scroll');
      });
    });

    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }

    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      this.scrollObserver?.observe(el);
    });
  }

  private initStaggerAnimation() {
    const songItems = document.querySelectorAll('app-library-song-item');
    songItems.forEach((item, index) => {
      (item as HTMLElement).style.setProperty('--song-index', index.toString());
    });
  }

  @HostListener('window:resize')
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

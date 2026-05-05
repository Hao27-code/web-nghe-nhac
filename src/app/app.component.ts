import { Component, HostListener } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { NgIf } from "@angular/common";
import { DesktopHeaderComponent } from './components/desktop-header/desktop-header.component';
import { MusicService } from "./services/music.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  imports: [IonApp, IonRouterOutlet, NgIf, DesktopHeaderComponent],
})
export class AppComponent {

  isDesktop = window.innerWidth >= 1200;
  isLoading: boolean = true;  // ✅ Chỉ loading lần đầu
  private isFirstLoad: boolean = true;  // ✅ Đánh dấu lần đầu

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private router: Router, private musicService: MusicService) {
    // ✅ Chỉ xử lý loading cho lần đầu tiên
    this.router.events.subscribe(event => {
      // Chỉ xử lý khi là lần đầu load app
      if (this.isFirstLoad && event instanceof NavigationEnd) {
        setTimeout(() => {
          this.isLoading = false;
          this.isFirstLoad = false;  // ✅ Đánh dấu đã load xong lần đầu
          console.log('Lần đầu load xong - Tắt loading');
        }, 1000);
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.isDesktop = window.innerWidth >= 1200;
    if (this.isDesktop) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/tabs/home']);
    }
  }

  ngOnInit() {
    // Khởi tạo audio
    const initAudio = async () => {
      await this.musicService.initAudioContext();
      document.removeEventListener('touchstart', initAudio);
      document.removeEventListener('click', initAudio);
    };
    document.addEventListener('touchstart', initAudio);
    document.addEventListener('click', initAudio);
  }
}

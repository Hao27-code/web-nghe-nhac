import {Component, HostListener} from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {NavigationEnd, Router} from "@angular/router";
import {NgIf} from "@angular/common";
import { DesktopHeaderComponent } from './components/desktop-header/desktop-header.component';
import {filter} from "rxjs";
import {MusicService} from "./services/music.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, NgIf, DesktopHeaderComponent],
})
export class AppComponent {


  isDesktop = window.innerWidth >= 1200 && !('ontouchstart' in window);
  private currentMode = window.innerWidth >= 1200;
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private router: Router,private musicService: MusicService) {}

  @HostListener('window:resize')
  onResize() {
    this.isDesktop = window.matchMedia('(min-width: 1200px)').matches;

    if (this.isDesktop) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/tabs/home']);
    }
  }
  ngOnInit() {
    // Khởi tạo audio sau lần tương tác đầu tiên của người dùng
    const initAudio = async () => {
      await this.musicService.initAudioContext();
      document.removeEventListener('touchstart', initAudio);
      document.removeEventListener('click', initAudio);
      console.log('Audio initialized by user interaction');
    };

    document.addEventListener('touchstart', initAudio);
    document.addEventListener('click', initAudio);
  }
}



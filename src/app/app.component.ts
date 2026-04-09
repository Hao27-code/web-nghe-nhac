import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';
import { DesktopHeaderComponent } from './components/desktop-header/desktop-header.component';
import {HeaderComponent} from "./components/header/header.component";
import {PlayerBarComponent} from "./components/player-bar/player-bar.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, NgIf, DesktopHeaderComponent, HeaderComponent, RouterOutlet, PlayerBarComponent],
})

export class AppComponent implements OnInit {
  private router = inject(Router);  // ✅ Dùng inject thay vì constructor
  isDesktop: boolean = false;

  ngOnInit(): void {
    this.checkScreen();
    this.handleRouting();

    window.addEventListener('resize', () => {
      const prev = this.isDesktop;
      this.checkScreen();
      if (prev !== this.isDesktop) {
        this.handleRouting();
      }
    });
  }

  checkScreen(): void {
    this.isDesktop = window.innerWidth >= 992;
  }

  handleRouting(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/' || currentUrl === '') {
      if (this.isDesktop) {
        this.router.navigateByUrl('/home');
      } else {
        this.router.navigateByUrl('/tabs/home');
      }
    }
  }
}

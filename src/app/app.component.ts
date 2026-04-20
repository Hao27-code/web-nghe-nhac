import {Component, HostListener} from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {NavigationEnd, Router} from "@angular/router";
import {NgIf} from "@angular/common";
import { DesktopHeaderComponent } from './components/desktop-header/desktop-header.component';
import {filter} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, NgIf, DesktopHeaderComponent],
})
export class AppComponent {
  isDesktop = window.innerWidth >= 1200;
  private currentMode = window.innerWidth >= 1200;
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private router: Router) {}

  @HostListener('window:resize')
  onResize() {
    this.isDesktop = window.matchMedia('(min-width: 1200px)').matches;

    if (this.isDesktop) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/tabs/home']);
    }
  }
}



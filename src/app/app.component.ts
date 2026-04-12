import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import { DesktopHeaderComponent } from './components/desktop-header/desktop-header.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, NgIf, DesktopHeaderComponent],
})
export class AppComponent {
  isDesktop = false;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private router: Router) {}

  ngOnInit() {
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

  checkScreen() {
    this.isDesktop = window.innerWidth >= 992;
  }

  handleRouting() {
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

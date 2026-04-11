import {Component, inject, Input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router, RouterOutlet} from "@angular/router";
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { SearchService } from '../../services/search.service';
import {CdkConnectedOverlay, CdkOverlayOrigin} from "@angular/cdk/overlay";
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-desktop-header',
  templateUrl: './desktop-header.component.html',
  styleUrls: ['./desktop-header.component.scss'],
  imports: [
    IonicModule, FormsModule, NgIf, NgFor, CdkConnectedOverlay, CdkOverlayOrigin, RouterOutlet
  ]
})
export class DesktopHeaderComponent implements OnInit {
  activeMenu: string = 'home';

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private router: Router) {}

  ngOnInit() {
    // Theo dõi route hiện tại để active menu
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      if (url.includes('/home')) {
        this.activeMenu = 'home';
      } else if (url.includes('/library')) {
        this.activeMenu = 'library';
      } else if (url.includes('/favorite')) {
        this.activeMenu = 'favorite';
      } else if (url.includes('/profile')) {
        this.activeMenu = 'profile';
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  onLogin() {
    // Xử lý đăng nhập
    console.log('Đăng nhập');
  }
}



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
  isDesktop = window.innerWidth >= 992;

  @HostListener('window:resize')
  onResize() {
    this.isDesktop = window.innerWidth >= 992;
  }
}



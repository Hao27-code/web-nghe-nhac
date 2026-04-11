import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { NgIf } from '@angular/common';
import {HeaderComponent} from "./components/header/header.component";
import { OnDestroy } from '@angular/core';
import {IonicModule, Platform} from '@ionic/angular';
import { Subscription } from 'rxjs';
import {DesktopHeaderComponent} from "./components/desktop-header/desktop-header.component";



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [NgIf, RouterOutlet, HeaderComponent, IonicModule, DesktopHeaderComponent],

})

export class AppComponent{
}

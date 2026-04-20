import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTitle} from '@ionic/angular/standalone';
import {IonicModule} from "@ionic/angular";
import {Router, RouterLink} from "@angular/router";
import { addIcons } from 'ionicons';
import { homeOutline, albumsOutline, heartOutline, personOutline } from 'ionicons/icons';
import {HeaderComponent} from "../components/header/header.component";
import { LibraryPage } from '../library/library.page';
import { FavoritePage } from '../favorite/favorite.page';
import {Platform} from "@angular/cdk/platform";
import {PlayerBarComponent} from "../components/player-bar/player-bar.component";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonContent, IonTitle, CommonModule, FormsModule, IonicModule, RouterLink, HeaderComponent, LibraryPage, FavoritePage, PlayerBarComponent]
})
export class TabsPage {

  constructor() {
  }
}
addIcons({
  'home-outline': homeOutline,
  'albums-outline': albumsOutline,
  'heart-outline': heartOutline,
  'person-outline': personOutline
});

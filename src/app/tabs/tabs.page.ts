import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {IonicModule} from "@ionic/angular";
import {RouterLink} from "@angular/router";
import { addIcons } from 'ionicons';
import { homeOutline, albumsOutline, heartOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule, RouterLink]
})
export class TabsPage  {

  constructor() { }


}
addIcons({
  'home-outline': homeOutline,
  'albums-outline': albumsOutline,
  'heart-outline': heartOutline,
  'person-outline': personOutline
});

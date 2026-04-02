import { Component } from '@angular/core';
import {HeaderComponent} from "../components/header/header.component";
import {IonicModule} from "@ionic/angular";
import {NgClass, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [HeaderComponent, IonicModule, NgClass, NgOptimizedImage],
})
export class HomePage {
  constructor() {}
  greeting='';
  ngOnInit() {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting='Chào buổi sáng';
    }else if(hour < 18){
      this.greeting='Chào buổi chiều'
    }else {
      this.greeting='Chào buổi tối'
    }
  }
  playlists=[
    {
      name: 'Top Hits Việt',
      image: 'assets/img/playlist.webp',
      type: 'Playlist'
    },{
      name: 'Chill K-pop',
      image: 'assets/img/mix.webp',
      type: 'Mix'
    },{
      name: 'Midnight Echoes',
      image: 'assets/img/album.webp',
      type: 'Album'
    }
  ];

}

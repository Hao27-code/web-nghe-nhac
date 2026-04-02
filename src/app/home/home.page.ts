import {Component, ElementRef, ViewChild} from '@angular/core';
import {HeaderComponent} from "../components/header/header.component";
import {IonicModule} from "@ionic/angular";
import {NgClass, NgOptimizedImage} from "@angular/common";
import { play, informationCircle } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [HeaderComponent, IonicModule, NgClass, NgOptimizedImage],

})
export class HomePage {
  icons = { play, informationCircle };
  currentIndex: number = 0;
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

  loopPlaylists = [
    ...this.playlists,
    this.playlists[0] // clone ảnh đầu
  ];
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  ngAfterViewInit(): void {

    setInterval(() => {

      const el = this.scrollContainer.nativeElement;
      const total = this.playlists.length;
      this.currentIndex++;

      el.scrollTo({
        left: el.clientWidth * this.currentIndex,
        behavior: 'smooth'
      });

      // 👉 khi tới slide clone
      if (this.currentIndex === total) {

        setTimeout(() => {

          el.style.scrollBehavior = 'auto'; // 🔥 tắt animation

          el.scrollLeft = 0;

          this.currentIndex = 0;

          setTimeout(() => {
            el.style.scrollBehavior = 'smooth'; // bật lại
          }, 50);

        }, 300);
      }
    }, 3000);

  }
}

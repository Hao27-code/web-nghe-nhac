import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-continue-listening',
  templateUrl: './continue-listening.component.html',
  styleUrls: ['./continue-listening.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class ContinueListeningComponent implements OnInit {

  constructor() {
  }


  @Input() audio!: HTMLAudioElement;
  continueList: any[] = [
    {
      title: 'Song 1',
      artist: 'Artist',
      image: 'assets/img/song1.jpg',
      currentTime: 50,
      duration: 200
    },
    {
      title: 'Song 2',
      artist: 'Artist',
      image: 'assets/img/song2.jpg',
      currentTime: 80,
      duration: 200
    }
  ];

  ngOnInit() {
    const data = localStorage.getItem('continueList');
    if (data) {
      this.continueList = JSON.parse(data);
    }
    this.loadData();
  }

  playContinue(item: any) {
    this.audio.src = item.src;
    this.audio.currentTime = item.currentTime || 0;
    this.audio.play();

    this.loadData(); // thêm dòng này
  }
  loadData() {
    const data = localStorage.getItem('continueList');
    if (data) {
      this.continueList = JSON.parse(data);
    }
  }

}

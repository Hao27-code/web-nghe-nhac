import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import { Input } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.page.html',
  styleUrls: ['./song-item.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule]
})
export class SongItemPage implements OnInit {
  @Input() song!: Song;

  isLiked: boolean = false;

  ngOnInit(): void {
    this.checkLikeStatus();
  }

  checkLikeStatus(): void {
    const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
    this.isLiked = likedSongs.includes(this.song.id);
  }

  toggleLike(event: Event): void {
    event.stopPropagation();
    this.isLiked = !this.isLiked;

    let likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
    if (this.isLiked) {
      likedSongs.push(this.song.id);
    } else {
      likedSongs = likedSongs.filter((id: number) => id !== this.song.id);
    }
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  }

  playSong(event: Event): void {
    event.stopPropagation();
    console.log('Phát bài:', this.song.title);
  }

  showOptions(event: Event): void {
    event.stopPropagation();
    console.log('Options:', this.song.title);
  }
}


import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {CommonModule} from "@angular/common";



export interface Playlist {
  id: number;
  title: string;
  artists: string;
  imageUrl: string;
  songs?: any[];
}


@Component({
  selector: 'app-playlist-card',
  standalone: true,
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.scss'],
  imports: [CommonModule, RouterModule, IonicModule],
})
export class PlaylistCardComponent {
  isPlaying = false;
  @Input() playlist!: Playlist;
  @Output() playClick = new EventEmitter<Playlist>();

  isHovered: boolean = false;

  onPlayClick(event: Event) {
    event.stopPropagation();
    this.playClick.emit(this.playlist);
  }

  setHover(isHover: boolean) {
    this.isHovered = isHover;
  }
}

import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { Music } from '../../models/music.model';

@Component({
  selector: 'app-music-card',
  templateUrl: './music-card.component.html',
  styleUrls: ['./music-card.component.scss'],
})
export class MusicCardComponent {
  @Input() music!: Music;
  @Output() play = new EventEmitter<Music>();

  isHovered = false;

  onPlayClick(event: Event) {
    event.stopPropagation();
    this.play.emit(this.music);
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

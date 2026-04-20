import {Component, HostListener, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HeaderComponent} from "../components/header/header.component";
import {IonicModule} from "@ionic/angular";
import { SongItemPage } from "../components/song-item/song-item.page";
import { Music } from '../models/music.model';
import { MusicService } from '../services/music.service';
import {PlayerBarComponent} from "../components/player-bar/player-bar.component";
import { LibrarySongItemComponent } from '../components/library-song-item/library-song-item.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonicModule, SongItemPage, PlayerBarComponent,LibrarySongItemComponent]
})
export class LibraryPage implements OnInit {

  allSongs: Music[] = [];
  isMobile: boolean = false;
  isTablet: boolean = false;
  isDesktop: boolean = false;


  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private musicService: MusicService) {}

  ngOnInit() {
    this.allSongs = this.musicService.getMusicList();
    this.checkScreenSize();
  }
  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }


  checkScreenSize() {
    const width = window.innerWidth;
    this.isMobile = width < 768;
    this.isTablet = width >= 768 && width < 1024;
    this.isDesktop = width >= 1024;
  }

  trackById(index: number, item: Music) {
    return item.id;
  }
}

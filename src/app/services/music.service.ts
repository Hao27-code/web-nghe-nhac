import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Music, ListeningHistory } from '../models/music.model';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private currentMusicSubject = new BehaviorSubject<Music | null>(null);
  currentMusic$ = this.currentMusicSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  private currentTimeSubject = new BehaviorSubject<number>(0);
  currentTime$ = this.currentTimeSubject.asObservable();

  private durationSubject = new BehaviorSubject<number>(0);
  duration$ = this.durationSubject.asObservable();

  private listeningHistory: ListeningHistory[] = [];
  private recentlyPlayedSubject = new BehaviorSubject<Music[]>([]);
  recentlyPlayed$ = this.recentlyPlayedSubject.asObservable();

  private audio: HTMLAudioElement | null = null;

  private sampleMusic: Music[] = [
    {
      id: 1,
      title: 'Midnight Echoes',
      artist: 'Electric Dreams',
      duration: 300,
      coverUrl: 'assets/img/domdom.jpg',    //đương dẫn ảnh
      audioUrl: 'assets/music/domdom_J97.mp3'
    },
    {
      id: 2,
      title: 'Vinyl Dreams',
      artist: 'Jazz Masters',
      duration: 268,
      coverUrl: 'assets/img/music2.jpg',
      audioUrl: 'assets/audio/song2.mp3'
    },
    {
      id: 3,
      title: 'Ocean Waves',
      artist: 'Ambient Soul',
      duration: 245,
      coverUrl: 'assets/img/music3.jpg',
      audioUrl: 'assets/audio/song3.mp3'
    },
    {
      id: 4,
      title: 'City Lights',
      artist: 'Night Riders',
      duration: 320,
      coverUrl: 'assets/img/music4.jpg',
      audioUrl: 'assets/audio/song4.mp3'
    }
  ];

  constructor() {
    this.loadHistory();
  }

  getMusicList(): Music[] {
    return this.sampleMusic;
  }

  getRecentlyPlayed(): Music[] {
    const historyIds = this.listeningHistory
      .sort((a, b) => new Date(b.lastPlayedAt).getTime() - new Date(a.lastPlayedAt).getTime())
      .map(h => h.musicId);
    const uniqueIds = [...new Set(historyIds)];
    return uniqueIds.map(id => this.sampleMusic.find(m => m.id === id)).filter(m => m) as Music[];
  }

  playMusic(music: Music, startTime?: number) {
    if (this.audio) {
      this.audio.pause();
    }

    this.audio = new Audio(music.audioUrl);
    this.currentMusicSubject.next(music);

    const savedTime = this.getSavedTime(music.id);
    const initialTime = startTime !== undefined ? startTime : savedTime;

    this.audio.currentTime = initialTime;
    this.currentTimeSubject.next(initialTime);

    this.audio.addEventListener('loadedmetadata', () => {
      this.durationSubject.next(this.audio!.duration);
    });

    this.audio.addEventListener('timeupdate', () => {
      this.currentTimeSubject.next(this.audio!.currentTime);
    });

    this.audio.addEventListener('ended', () => {
      this.isPlayingSubject.next(false);
      this.saveProgress(music.id, 0);
    });

    this.audio.play();
    this.isPlayingSubject.next(true);

    this.saveToHistory(music.id, initialTime);
  }

  pauseMusic() {
    if (this.audio) {
      this.audio.pause();
      this.isPlayingSubject.next(false);
      if (this.currentMusicSubject.value) {
        this.saveProgress(this.currentMusicSubject.value.id, this.audio.currentTime);
      }
    }
  }

  resumeMusic() {
    if (this.audio && this.currentMusicSubject.value) {
      this.audio.play();
      this.isPlayingSubject.next(true);
    }
  }

  seekTo(time: number) {
    if (this.audio) {
      this.audio.currentTime = time;
      this.currentTimeSubject.next(time);
    }
  }

  playNext() {
    const currentMusic = this.currentMusicSubject.value;
    const musicList = this.getMusicList();
    if (currentMusic) {
      const currentIndex = musicList.findIndex(m => m.id === currentMusic.id);
      const nextIndex = (currentIndex + 1) % musicList.length;
      this.playMusic(musicList[nextIndex], 0);
    }
  }

  private saveToHistory(musicId: number, currentTime: number) {
    const existingIndex = this.listeningHistory.findIndex(h => h.musicId === musicId);
    const historyEntry: ListeningHistory = {
      musicId,
      lastPlayedAt: new Date(),
      currentTime
    };

    if (existingIndex !== -1) {
      this.listeningHistory[existingIndex] = historyEntry;
    } else {
      this.listeningHistory.push(historyEntry);
    }

    localStorage.setItem('listeningHistory', JSON.stringify(this.listeningHistory));
    this.recentlyPlayedSubject.next(this.getRecentlyPlayed());
  }

  private saveProgress(musicId: number, currentTime: number) {
    const existingIndex = this.listeningHistory.findIndex(h => h.musicId === musicId);
    if (existingIndex !== -1) {
      this.listeningHistory[existingIndex].currentTime = currentTime;
      localStorage.setItem('listeningHistory', JSON.stringify(this.listeningHistory));
    }
  }

  private getSavedTime(musicId: number): number {
    const history = this.listeningHistory.find(h => h.musicId === musicId);
    return history ? history.currentTime : 0;
  }

  private loadHistory() {
    const saved = localStorage.getItem('listeningHistory');
    if (saved) {
      this.listeningHistory = JSON.parse(saved);
      this.recentlyPlayedSubject.next(this.getRecentlyPlayed());
    }
  }

  toggleFavorite(music: Music) {
    const favorites = this.getFavorites();
    const index = favorites.findIndex(f => f.id === music.id);
    if (index !== -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(music);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  isFavorite(music: Music): boolean {
    return this.getFavorites().some(f => f.id === music.id);
  }

  private getFavorites(): Music[] {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  }
}

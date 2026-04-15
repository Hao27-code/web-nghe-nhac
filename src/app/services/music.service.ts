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

  // ========== LỊCH SỬ NGHE NHẠC ==========
  private listeningHistory: ListeningHistory[] = [];
  private recentlyPlayedSubject = new BehaviorSubject<Music[]>([]);
  recentlyPlayed$ = this.recentlyPlayedSubject.asObservable();

  getAudioElement(): HTMLAudioElement | null {
    return this.audio;
  }
  private audio: HTMLAudioElement | null = null;

  private sampleMusic: Music[] = [
    {
      id: 1,
      title: 'Đom Đóm',
      artist: 'Jack - J97',
      duration: 300,
      coverUrl: 'assets/img/domdom.jpg',
      audioUrl: 'assets/music/domdom_J97.mp3'
    },
    {
      id: 2,
      title: 'Đứa Trẻ Mùa Đông Chí',
      artist: 'Jack - J97',
      duration: 288,
      coverUrl: 'assets/img/duatremuadongchi.jpg',
      audioUrl: 'assets/music/duatremuadongchi_J97.mp3'
    },
    {
      id: 3,
      title: 'Liễu Thanh Yên',
      artist: 'Jack - J97',
      duration: 245,
      coverUrl: 'assets/img/lieuthanhyen.jpg',
      audioUrl: 'assets/music/lieuthanhyen_J97.mp3'
    },
    {
      id: 4,
      title: 'Ngoại Lệ',
      artist: 'Jack - J97',
      duration: 320,
      coverUrl: 'assets/img/ngoaile.jpg',
      audioUrl: 'assets/music/ngoaile_J97.mp3'
    },
    {
      id: 5,
      title: 'Chúng Ta Rồi Sẽ Hạnh Phúc',
      artist: 'Jack - J97',
      duration: 320,
      coverUrl: 'assets/img/chungtaroisehanhphuc.jpg',
      audioUrl: 'assets/music/chungtaroisehanhphuc.mp3'
    },
    {
      id: 6,
      title: 'Có mình và ta',
      artist: 'Nguyễn Vi',
      duration: 320,
      coverUrl: 'assets/img/cominhvata.jpg',
      audioUrl: 'assets/music/cominhvata.mp3'
    },
    {
      id: 7,
      title: 'Cuối Cùng Thì',
      artist: 'Jack - J97',
      duration: 320,
      coverUrl: 'assets/img/cuoicungthi.jpg',
      audioUrl: 'assets/music/cuoicungthi.mp3'
    },
    {
      id: 8,
      title: 'Đám Cưới Miền Tây',
      artist: 'Hana Cẩm Tiên',
      duration: 320,
      coverUrl: 'assets/img/damcuoimientay.jpg',
      audioUrl: 'assets/music/damcuoimientay.mp3'
    },
    {
      id: 9,
      title: 'Mạnh Bà',
      artist: 'Linh Hương Luz',
      duration: 320,
      coverUrl: 'assets/img/manhba.jpg',
      audioUrl: 'assets/music/manhba.mp3'
    },
    {
      id: 10,
      title: 'Trạm Dừng Chân',
      artist: 'Jack - J97',
      duration: 320,
      coverUrl: 'assets/img/tramdungchan.jpg',
      audioUrl: 'assets/music/tramdungchan.mp3'
    },
    {
      id: 11,
      title: 'Trịnh Gia',
      artist: 'Jack - J97',
      duration: 320,
      coverUrl: 'assets/img/trinhgia.jpg',
      audioUrl: 'assets/music/trinhgia.mp3'
    },
    {
      id: 12,
      title: 'Vực Thẩm Của Bình Yên',
      artist: 'Jack - J97',
      duration: 320,
      coverUrl: 'assets/img/vucthamcuabinhyen.jpg',
      audioUrl: 'assets/music/vucthamcuabinhyen.mp3'
    }
  ];

  constructor() {
    this.loadHistory();
  }
  getAudio(): HTMLAudioElement | null {
    return this.audio;
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

  getSavedTime(musicId: number): number {
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

  // Phát ngẫu nhiên một bài từ danh sách yêu thích
  playRandomFromFavorites(): void {
    const favorites = this.getFavorites();
    if (favorites.length === 0) {
      console.log('Chưa có bài hát yêu thích nào');
      return;
    }

    const randomIndex = Math.floor(Math.random() * favorites.length);
    const randomSong = favorites[randomIndex];
    const savedTime = this.getSavedTime(randomSong.id);
    this.playMusic(randomSong, savedTime);
  }

// Lấy danh sách yêu thích (public)
  getFavoritesList(): Music[] {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  }
}

export interface Music {
  id: number;
  title: string;
  artist: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
}

export interface ListeningHistory {
  musicId: number;
  lastPlayedAt: Date;
  currentTime: number;
}

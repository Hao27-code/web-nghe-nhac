export interface Music {
  id: number;
  title: string;      // Tên bài hát
  artist: string;     // Ca sĩ
  duration: number;   // Thời gian (giây)
  coverUrl: string;   // URL ảnh bìa
  audioUrl: string;   // URL file nhạc
  album?: string;     // Thêm album (tùy chọn, vì có bài không có album)
}

export interface ListeningHistory {
  musicId: number;
  lastPlayedAt: Date;
  currentTime: number;
}

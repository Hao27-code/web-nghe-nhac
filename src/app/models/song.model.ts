// Interface định nghĩa cấu trúc của một bài hát
export interface Song {
  id: number;          // ID duy nhất của bài hát
  title: string;       // Tên bài hát
  artist: string;      // Tên ca sĩ / nghệ sĩ
  imageUrl: string;    // Đường dẫn ảnh đại diện (60x60)
}

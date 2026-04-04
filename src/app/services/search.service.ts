import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  suggestions = [
    'hoa nở bên đường',
    'hoàng dũng',
    'hoa có lau',
    'cô dại và hoa dành dành'
  ];
  history = [
    {
      name: 'Sóng Gió',
      artist: 'Jack, K-ICM',
      image: 'assets/img/song1.jpg'
    },
    {
      name: 'Bạc Phận',
      artist: 'Jack, K-ICM',
      image: 'assets/img/bac_phan.jpg',
    }
  ];
  //lọc
  getFiltered(keyword: string): string[] {
    if (!keyword) return [];

    return this.suggestions.filter(item =>
      item.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  getHistory(keyword: string) {
    return this.history.filter(item =>
      item.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }
}

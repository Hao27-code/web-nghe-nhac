import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  suggestions = [
    'Đom Đóm',
    'Liễu thanh yên',
    'Mạnh bà',
    'Cuối cùng thì'
  ];
  history = [
    {
      name: 'Đứa Trẻ Mùa Đông Chí',
      artist: 'Jack-J97',
      image: 'assets/img/duatremuadongchi.jpg'
    },
    {
      name: 'Mạnh Bà',
      artist: 'Linh Hương Luz',
      image: 'assets/img/manhba.jpg',
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

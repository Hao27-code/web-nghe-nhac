import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule} from "@ionic/angular";
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule]
})
export class SearchPage {

  // eslint-disable-next-line @angular-eslint/prefer-inject
  // @ts-ignore
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private location: Location,private router: Router) {
  }

  //Quay về trang trước
  goBack() {
    this.location.back();
  }

  keyword = '';

  onSearch($event: any) {
    this.keyword = $event.target.value;
  }
  get filteredSuggestions() {
    return this.suggestions.filter(item =>
      item.toLowerCase().includes(this.keyword.toLowerCase())
    );
  }
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

  protected clearHistory() {

  }
  get results() {
    return this.history.filter(item =>
      item.name.toLowerCase().includes(this.keyword.toLowerCase())
    );
  }
}


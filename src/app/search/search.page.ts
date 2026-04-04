import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule} from "@ionic/angular";
import { Location } from '@angular/common';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule]
})
export class SearchPage {

   keyword = '';
  // eslint-disable-next-line @angular-eslint/prefer-inject
  // @ts-ignore
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private location: Location,private searchService: SearchService) {
  }
  onSearch(event: any) {
    this.keyword = event.target.value;
  }
  //Quay về trang trước
  goBack() {
    this.location.back();
  }
  protected clearHistory() {}

  get suggestions(): string[] {
    return this.searchService.getFiltered(this.keyword);
  }
  get results(): any[] {
    return this.searchService.getHistory(this.keyword);
  }
  get history() {
    return this.searchService.getHistory(this.keyword);
  }
}


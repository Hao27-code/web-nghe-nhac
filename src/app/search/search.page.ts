import {IonicModule} from "@ionic/angular";
import {Component} from "@angular/core";
import { Location } from '@angular/common';


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [ IonicModule]
})

export class SearchPage {
  private router: any;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  // @ts-ignore
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private location: Location) {
  }

  //Quay về trang trước
  goBack() {
    this.location.back();
  }

  protected onSearch($event: any) {

  }

  suggestions = [
    '50 năm về sau',
    'cô dại và hoa dành dành',
    'hạt mưa vương vấn',
    'mở lòng vì ai'
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
      image: 'assets/img/song2.jpg'
    }
  ];

  protected clearHistory() {

  }
}

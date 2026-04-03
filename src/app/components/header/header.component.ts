import { Component } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    IonicModule,
  ]
})
export class HeaderComponent   {

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private router:Router) { }

  goSearch() {
    this.router.navigate(['/tabs/search']);
  }
}

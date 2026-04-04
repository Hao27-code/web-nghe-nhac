import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonTitle} from '@ionic/angular/standalone';
import {HeaderComponent} from "../components/header/header.component";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
  standalone: true,
  imports: [ IonTitle, CommonModule, FormsModule, HeaderComponent, IonicModule]
})
export class FavoritePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

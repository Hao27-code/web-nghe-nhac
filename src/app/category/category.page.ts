import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {Playlist, PlaylistCardComponent} from "../components/playlist-card/playlist-card.component";
import {PlaylistSliderComponent} from "../components/playlist-slider/playlist-slider.component";


@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, PlaylistSliderComponent,PlaylistCardComponent]
})
export class CategoryPage {
  categoryPlaylists: Playlist[] = [
    { id: 1, title: 'cuối cùng thì mình cũng chia ly', artists: 'Jack - J97, DatKaa, Khang Việt...', imageUrl: 'assets/img/theloai_chill.jpg' },
    { id: 2, title: 'đã từng xem nhau là tất cả', artists: 'Quân A.P, thao linh, Đặng Thiên Chí...', imageUrl: 'assets/img/theloai_chill1.jpg' },
    { id: 3, title: 'nếu duyên', artists: 'Thành Đạt, Lê Bảo Bình, Hương Ly...', imageUrl: 'assets/img/theloai_chill2.jpg' },
    { id: 4, title: 'người thứ ba', artists: 'Văn Mai Hương, Quân A.P, Bảo Anh...', imageUrl: 'assets/img/theloai_chill3.jpg' },
    { id: 5, title: 'Song Ca V-Pop', artists: 'GREY D, MIN★, VƯƠNG BÌNH...', imageUrl: 'assets/img/theloai_chill4.jpg' },
    { id: 6, title: 'Nhạc Trẻ Hay Nhất', artists: 'Sơn Tùng M-TP, Hòa Minzy...', imageUrl: 'assets/img/theloai_chill5.jpg' }
  ];
}

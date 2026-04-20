import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HeaderComponent} from "../components/header/header.component";
import {IonicModule} from "@ionic/angular";
import { addIcons } from 'ionicons';
import {
  playCircleOutline,
  colorPaletteOutline,
  downloadOutline,
  albumsOutline,
  videocamOutline,
  headsetOutline,
  notificationsOutline,
  informationCircleOutline,
  helpCircleOutline,
  starOutline,
  documentTextOutline,
  shieldOutline,
  businessOutline,
  diamondOutline,
  chevronForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonicModule]
})
export class ProfilePage {

  user = {
    name: 'Minh Anh',
    email: 'minhanh@nghenhac.com',
    avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg', // Ảnh mặc định
    joinDate: 'Tháng 3 năm 2025',
    favoriteGenres: ['Pop', 'Rock', 'Electronic']
  };

  constructor() {
    addIcons({
      'play-circle-outline': playCircleOutline,
      'color-palette-outline': colorPaletteOutline,
      'download-outline': downloadOutline,
      'albums-outline': albumsOutline,
      'videocam-outline': videocamOutline,
      'headset-outline': headsetOutline,
      'notifications-outline': notificationsOutline,
      'information-circle-outline': informationCircleOutline,
      'help-circle-outline': helpCircleOutline,
      'star-outline': starOutline,
      'document-text-outline': documentTextOutline,
      'shield-outline': shieldOutline,
      'business-outline': businessOutline,
      'diamond-outline': diamondOutline,
      'chevron-forward-outline': chevronForwardOutline
    });
  }

  editProfile() {
    console.log('Chỉnh sửa hồ sơ');
  }

  logout() {
    console.log('Đăng xuất');
  }




}

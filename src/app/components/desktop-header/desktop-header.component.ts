import { Component } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router, RouterLinkActive} from "@angular/router";
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { SearchService } from '../../services/search.service';
import {CdkConnectedOverlay, CdkOverlayOrigin} from "@angular/cdk/overlay";
import { ConnectedPosition } from '@angular/cdk/overlay';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-desktop-header',
  templateUrl: './desktop-header.component.html',
  styleUrls: ['./desktop-header.component.scss'],
  imports: [
    IonicModule, FormsModule, NgIf, NgFor, CdkConnectedOverlay, CdkOverlayOrigin, RouterLinkActive, RouterModule
  ]
})
export class DesktopHeaderComponent {

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private router: Router,private searchService: SearchService) {}
  // 👇 gọi service
  keyword: string = '';

  get suggestions(): string[] {
    return this.searchService.getFiltered(this.keyword);
  }

  onSearch(event: any) {
    this.keyword = event.target.value;
  }
  positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 8
    }
  ];
}


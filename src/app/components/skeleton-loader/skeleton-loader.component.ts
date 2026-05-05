import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-wrapper" [class.skeleton-exit]="!isLoading">
      <!-- Header -->
      <div class="skeleton-header" *ngIf="hasHeader">
        <div class="skeleton-cover" *ngIf="hasCover"></div>
        <div class="skeleton-info">
          <div class="skeleton-title"></div>
          <div class="skeleton-desc" *ngIf="hasDesc"></div>
        </div>
      </div>

      <!-- Table header -->
      <div class="skeleton-table-header" *ngIf="hasTableHeader">
        <div class="skeleton-line"></div>
      </div>

      <!-- List items -->
      <div class="skeleton-list">
        <div class="skeleton-item" *ngFor="let item of items">
          <div class="skeleton-avatar" *ngIf="hasAvatar"></div>
          <div class="skeleton-info">
            <div class="skeleton-title-line"></div>
            <div class="skeleton-desc-line" *ngIf="hasSubtitle"></div>
          </div>
          <div class="skeleton-action" *ngIf="hasAction"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-wrapper {
      animation: fadeIn 0.4s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.6; }
    }
    .skeleton-cover, .skeleton-title, .skeleton-desc, .skeleton-line,
    .skeleton-avatar, .skeleton-title-line, .skeleton-desc-line, .skeleton-action {
      background: linear-gradient(90deg, #2a2a3e, #3a3a4e, #2a2a3e);
      background-size: 200% 100%;
      animation: pulse 1.5s ease-in-out infinite;
      border-radius: 8px;
    }
    .skeleton-header {
      display: flex;
      gap: 32px;
      margin-bottom: 32px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 16px;
      padding: 20px;
      align-items: center;
    }
    .skeleton-cover { width: 200px; height: 200px; border-radius: 16px; flex-shrink: 0; }
    .skeleton-info { flex: 1; }
    .skeleton-title { width: 60%; height: 48px; margin-bottom: 16px; }
    .skeleton-desc { width: 40%; height: 20px; }
    .skeleton-table-header { margin-bottom: 20px; }
    .skeleton-line { height: 40px; width: 100%; border-radius: 8px; }
    .skeleton-list { display: flex; flex-direction: column; gap: 8px; }
    .skeleton-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 12px;
    }
    .skeleton-avatar { width: 48px; height: 48px; border-radius: 8px; flex-shrink: 0; }
    .skeleton-title-line { width: 200px; height: 18px; margin-bottom: 8px; }
    .skeleton-desc-line { width: 120px; height: 14px; }
    .skeleton-action { width: 40px; height: 16px; margin-left: auto; }
    .skeleton-wrapper.skeleton-exit { animation: fadeOut 0.3s ease-out forwards; }
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-20px); }
    }
    @media (max-width: 768px) {
      .skeleton-header { flex-direction: column; text-align: center; }
      .skeleton-cover { width: 140px; height: 140px; }
      .skeleton-title { width: 80%; margin: 0 auto 12px; }
      .skeleton-action { display: none; }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() isLoading: boolean = true;
  @Input() items: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  @Input() hasHeader: boolean = true;
  @Input() hasCover: boolean = true;
  @Input() hasDesc: boolean = true;
  @Input() hasTableHeader: boolean = true;
  @Input() hasAvatar: boolean = true;
  @Input() hasSubtitle: boolean = true;
  @Input() hasAction: boolean = true;
}

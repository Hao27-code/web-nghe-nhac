import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  showLoading() {
    console.log('LoadingService: showLoading');
    this.loadingSubject.next(true);
  }

  hideLoading() {
    console.log('LoadingService: hideLoading');
    this.loadingSubject.next(false);  // ← Phải là false
  }

  resetLoading() {
    console.log('LoadingService: resetLoading');
    this.loadingSubject.next(true);
  }
}

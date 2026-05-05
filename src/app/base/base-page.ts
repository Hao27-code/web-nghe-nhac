import { Component, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { ScrollAnimationService } from '../services/scroll-animation.service';

@Component({
  template: ''
})
export abstract class BasePage implements AfterViewInit, OnDestroy {

  protected loadingService = inject(LoadingService);
  protected scrollAnimation = inject(ScrollAnimationService);
  protected router = inject(Router);

  isLoading: boolean = true;
  private routerSubscription: Subscription | null = null;
  private reloadFlag: boolean = false;

  constructor() {
    // Lắng nghe sự thay đổi của loading state
    this.loadingService.loading$.subscribe(loading => {
      console.log('BasePage: loading state changed to', loading);
      this.isLoading = loading;
    });
  }

  ngAfterViewInit() {
    console.log('BasePage: ngAfterViewInit');

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === this.router.url) {
        this.onPageReenter();
      }
    });

    this.loadData();
  }

  abstract loadData(): void;

  protected onPageReenter() {
    if (!this.reloadFlag) {
      this.reloadFlag = true;
      this.loadingService.resetLoading();
      this.scrollAnimation.resetAnimations();
      this.loadData();
      setTimeout(() => { this.reloadFlag = false; }, 1000);
    }
  }

  protected initScrollAnimation(selector: string = '.reveal-on-scroll') {
    setTimeout(() => {
      this.scrollAnimation.initScrollAnimations(selector);
    }, 100);
  }

  protected initStaggerAnimation(selector: string = '.stagger-item', delayPerIndex: number = 0.05) {
    setTimeout(() => {
      this.scrollAnimation.initStaggerAnimation(selector, delayPerIndex);
    }, 150);
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    this.scrollAnimation.disconnect();
  }
}

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollAnimationService {

  private scrollObserver: IntersectionObserver | null = null;
  private isBrowser: boolean;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  initScrollAnimations(selector: string = '.reveal-on-scroll') {
    if (!this.isBrowser) return;

    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.classList.add('reveal-on-scroll');
    });

    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }

    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        } else {
          entry.target.classList.remove('revealed');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      this.scrollObserver?.observe(el);
    });
  }

  initStaggerAnimation(selector: string, delayPerIndex: number = 0.05) {
    if (!this.isBrowser) return;

    const items = document.querySelectorAll(selector);
    items.forEach((item, index) => {
      (item as HTMLElement).style.setProperty('--item-index', index.toString());
      (item as HTMLElement).style.setProperty('--delay-per-index', delayPerIndex.toString());
    });
  }

  resetAnimations() {
    if (!this.isBrowser) return;

    const elements = document.querySelectorAll('.revealed, .reveal-on-scroll');
    elements.forEach(el => {
      el.classList.remove('revealed', 'reveal-on-scroll');
    });
  }

  disconnect() {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
      this.scrollObserver = null;
    }
  }
}

import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { deviceGuard } from './device-guard';

describe('deviceGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => deviceGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

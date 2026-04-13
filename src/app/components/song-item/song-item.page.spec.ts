import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongItemPage } from './song-item.page';

describe('SongItemPage', () => {
  let component: SongItemPage;
  let fixture: ComponentFixture<SongItemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SongItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

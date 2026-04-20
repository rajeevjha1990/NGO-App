import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScanerPage } from './scaner.page';

describe('ScanerPage', () => {
  let component: ScanerPage;
  let fixture: ComponentFixture<ScanerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

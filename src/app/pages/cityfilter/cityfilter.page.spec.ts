import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityfilterPage } from './cityfilter.page';

describe('CityfilterPage', () => {
  let component: CityfilterPage;
  let fixture: ComponentFixture<CityfilterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CityfilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

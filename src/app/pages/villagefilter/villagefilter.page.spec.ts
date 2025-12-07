import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VillagefilterPage } from './villagefilter.page';

describe('VillagefilterPage', () => {
  let component: VillagefilterPage;
  let fixture: ComponentFixture<VillagefilterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VillagefilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

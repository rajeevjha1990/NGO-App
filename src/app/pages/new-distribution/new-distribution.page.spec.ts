import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewDistributionPage } from './new-distribution.page';

describe('NewDistributionPage', () => {
  let component: NewDistributionPage;
  let fixture: ComponentFixture<NewDistributionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDistributionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

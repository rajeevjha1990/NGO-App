import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatefilterPage } from './statefilter.page';

describe('StatefilterPage', () => {
  let component: StatefilterPage;
  let fixture: ComponentFixture<StatefilterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StatefilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

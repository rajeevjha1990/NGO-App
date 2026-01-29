import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramViewPage } from './program-view.page';

describe('ProgramViewPage', () => {
  let component: ProgramViewPage;
  let fixture: ComponentFixture<ProgramViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

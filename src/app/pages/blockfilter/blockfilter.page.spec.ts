import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockfilterPage } from './blockfilter.page';

describe('BlockfilterPage', () => {
  let component: BlockfilterPage;
  let fixture: ComponentFixture<BlockfilterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockfilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

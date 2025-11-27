import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DistributedSaintriesPage } from './distributed-saintries.page';

describe('DistributedSaintriesPage', () => {
  let component: DistributedSaintriesPage;
  let fixture: ComponentFixture<DistributedSaintriesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributedSaintriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

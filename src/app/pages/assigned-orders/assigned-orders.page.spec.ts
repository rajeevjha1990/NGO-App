import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignedOrdersPage } from './assigned-orders.page';

describe('AssignedOrdersPage', () => {
  let component: AssignedOrdersPage;
  let fixture: ComponentFixture<AssignedOrdersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

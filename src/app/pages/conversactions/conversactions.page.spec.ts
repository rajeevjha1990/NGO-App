import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConversactionsPage } from './conversactions.page';

describe('ConversactionsPage', () => {
  let component: ConversactionsPage;
  let fixture: ComponentFixture<ConversactionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversactionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

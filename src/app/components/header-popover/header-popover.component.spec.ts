import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeaderPopoverComponent } from './header-popover.component';

describe('HeaderPopoverComponent', () => {
  let component: HeaderPopoverComponent;
  let fixture: ComponentFixture<HeaderPopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HeaderPopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

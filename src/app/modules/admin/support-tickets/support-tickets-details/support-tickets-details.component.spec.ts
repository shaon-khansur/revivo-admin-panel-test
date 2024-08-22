import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTicketsDetailsComponent } from './support-tickets-details.component';

describe('SupportTicketsDetailsComponent', () => {
  let component: SupportTicketsDetailsComponent;
  let fixture: ComponentFixture<SupportTicketsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SupportTicketsDetailsComponent]
    });
    fixture = TestBed.createComponent(SupportTicketsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

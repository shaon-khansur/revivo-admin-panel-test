import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberDrawerComponent } from './subscriber-drawer.component';

describe('SubscriberDrawerComponent', () => {
  let component: SubscriberDrawerComponent;
  let fixture: ComponentFixture<SubscriberDrawerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SubscriberDrawerComponent]
    });
    fixture = TestBed.createComponent(SubscriberDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealMiningStatusComponent } from './deal-mining-status.component';

describe('DealMiningStatusComponent', () => {
  let component: DealMiningStatusComponent;
  let fixture: ComponentFixture<DealMiningStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DealMiningStatusComponent]
    });
    fixture = TestBed.createComponent(DealMiningStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

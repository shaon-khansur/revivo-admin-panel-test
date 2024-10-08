import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealSettingsComponent } from './deal-settings.component';

describe('DealSettingsComponent', () => {
  let component: DealSettingsComponent;
  let fixture: ComponentFixture<DealSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DealSettingsComponent]
    });
    fixture = TestBed.createComponent(DealSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

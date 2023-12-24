import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FareUpsellApiErroComponent } from './fare-upsell-api-erro.component';

describe('FareUpsellApiErroComponent', () => {
  let component: FareUpsellApiErroComponent;
  let fixture: ComponentFixture<FareUpsellApiErroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FareUpsellApiErroComponent]
    });
    fixture = TestBed.createComponent(FareUpsellApiErroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

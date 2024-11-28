import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppierAddComponent } from './suppier-add.component';

describe('SuppierAddComponent', () => {
  let component: SuppierAddComponent;
  let fixture: ComponentFixture<SuppierAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SuppierAddComponent]
    });
    fixture = TestBed.createComponent(SuppierAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

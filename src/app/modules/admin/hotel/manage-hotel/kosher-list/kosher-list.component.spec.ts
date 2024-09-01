import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KosherListComponent } from './kosher-list.component';

describe('KosherListComponent', () => {
  let component: KosherListComponent;
  let fixture: ComponentFixture<KosherListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KosherListComponent]
    });
    fixture = TestBed.createComponent(KosherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

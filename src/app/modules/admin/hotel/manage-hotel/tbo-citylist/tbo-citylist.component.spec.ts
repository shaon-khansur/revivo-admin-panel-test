import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TboCitylistComponent } from './tbo-citylist.component';

describe('TboCitylistComponent', () => {
  let component: TboCitylistComponent;
  let fixture: ComponentFixture<TboCitylistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TboCitylistComponent]
    });
    fixture = TestBed.createComponent(TboCitylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

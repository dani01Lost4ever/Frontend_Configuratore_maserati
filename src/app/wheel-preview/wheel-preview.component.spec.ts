import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelPreviewComponent } from './wheel-preview.component';

describe('WheelPreviewComponent', () => {
  let component: WheelPreviewComponent;
  let fixture: ComponentFixture<WheelPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WheelPreviewComponent]
    });
    fixture = TestBed.createComponent(WheelPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

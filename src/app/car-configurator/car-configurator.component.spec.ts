import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfiguratorComponent } from './car-configurator.component';

describe('ProductPreviewComponent', () => {
  let component: CarConfiguratorComponent;
  let fixture: ComponentFixture<CarConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarConfiguratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

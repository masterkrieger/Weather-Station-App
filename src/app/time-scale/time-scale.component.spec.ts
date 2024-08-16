import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeScaleComponent } from './time-scale.component';

describe('TimeScaleComponent', () => {
  let component: TimeScaleComponent;
  let fixture: ComponentFixture<TimeScaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeScaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed, inject } from '@angular/core/testing';

import { TimeScaleService } from './time-scale.service';

describe('TimeScaleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeScaleService]
    });
  });

  it('should be created', inject([TimeScaleService], (service: TimeScaleService) => {
    expect(service).toBeTruthy();
  }));
});

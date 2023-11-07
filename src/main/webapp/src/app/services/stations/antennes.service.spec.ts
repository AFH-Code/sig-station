import { TestBed } from '@angular/core/testing';

import { AntennesService } from './antennes.service';

describe('AntennesService', () => {
  let service: AntennesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AntennesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

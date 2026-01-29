import { TestBed } from '@angular/core/testing';

import { RajeevhttpService } from './rajeevhttp.service';

describe('RajeevhttpService', () => {
  let service: RajeevhttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RajeevhttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

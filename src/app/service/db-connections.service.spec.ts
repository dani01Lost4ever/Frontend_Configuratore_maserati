import { TestBed } from '@angular/core/testing';

import { DbConnectionsService } from './db-connections.service';

describe('DbConnectionsService', () => {
  let service: DbConnectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbConnectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

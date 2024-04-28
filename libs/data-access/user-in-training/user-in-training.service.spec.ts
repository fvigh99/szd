import { TestBed } from '@angular/core/testing';

import { UserInTrainingService } from './user-in-training.service';

describe('UserInTrainingService', () => {
  let service: UserInTrainingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInTrainingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

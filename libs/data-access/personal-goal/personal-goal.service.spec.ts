import { TestBed } from '@angular/core/testing';

import { PersonalGoalService } from './personal-goal.service';

describe('PersonalGoalService', () => {
  let service: PersonalGoalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalGoalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

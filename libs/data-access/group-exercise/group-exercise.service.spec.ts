import { TestBed } from '@angular/core/testing';

import { GroupExerciseService } from './group-exercise.service';

describe('GroupExerciseService', () => {
  let service: GroupExerciseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupExerciseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

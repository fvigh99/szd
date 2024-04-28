import { TestBed } from '@angular/core/testing';

import { EarnedAchievementService } from './earned-achievement.service';

describe('EarnedAchievementService', () => {
  let service: EarnedAchievementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EarnedAchievementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

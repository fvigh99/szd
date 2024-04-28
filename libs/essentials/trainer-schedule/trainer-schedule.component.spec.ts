import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainerScheduleComponent } from './trainer-schedule.component';

describe('TrainerScheduleComponent', () => {
  let component: TrainerScheduleComponent;
  let fixture: ComponentFixture<TrainerScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerScheduleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainerScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

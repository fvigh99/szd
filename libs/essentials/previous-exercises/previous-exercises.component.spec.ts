import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviousExercisesComponent } from './previous-exercises.component';

describe('PreviousExercisesComponent', () => {
  let component: PreviousExercisesComponent;
  let fixture: ComponentFixture<PreviousExercisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviousExercisesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviousExercisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

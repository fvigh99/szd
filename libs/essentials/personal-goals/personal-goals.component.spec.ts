import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalGoalsComponent } from './personal-goals.component';

describe('PersonalGoalsComponent', () => {
  let component: PersonalGoalsComponent;
  let fixture: ComponentFixture<PersonalGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalGoalsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ExerciseService } from 'libs/data-access/exercise/exercise.service';
import { Observable } from 'rxjs';
import { Exercise, Machine, User } from 'libs/model/FcServerModel';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { MachineService } from 'libs/data-access/machine/machine.service';
import { AccountService } from 'libs/data-access/account/account.service';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'fc-previous-exercises',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    AsyncPipe,
    NgIf,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    FormsModule,
    CalendarModule,
    AutoCompleteModule,
    InputNumberModule,
  ],
  templateUrl: './previous-exercises.component.html',
  styleUrl: './previous-exercises.component.scss',
})
export class PreviousExercisesComponent implements OnInit {
  public exerciseList: Observable<Exercise>;
  public newExercise: Exercise;
  public newExerciseDialog = false;
  public machineList: any;
  public selectedMachine: Machine;
  public filteredMachines: Machine[] | undefined;
  public loggedInUser: User;
  constructor(
    private exerciseService: ExerciseService,
    private messageService: MessageService,
    private machineService: MachineService,
    private accountService: AccountService
  ) {}
  ngOnInit(): void {
    this.fetchData();
    this.machineService.fetch().subscribe((result) => {
      this.machineList = result;
    });
    this.loggedInUser = this.accountService.userValue.user_object;
  }

  public fetchData() {
    this.exerciseList = this.exerciseService.fetch();
  }

  public filterMachine(event: AutoCompleteCompleteEvent) {
    let filtered: Machine[] = [];
    let query = event.query;

    for (let i = 0; i < (this.machineList as Machine[]).length; i++) {
      let machine = (this.machineList as Machine[])[i];
      if (machine.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(machine);
      }
    }

    this.filteredMachines = filtered;
  }

  public openNew() {
    this.newExercise = {
      machine: {},
    };
    this.newExerciseDialog = true;
  }

  public saveNewExercise() {
    if (
      (this.newExercise.weight && this.newExercise.count) ||
      (this.newExercise.intensity && this.newExercise.duration)
    ) {
      this.newExercise.user = this.loggedInUser;
      this.newExercise.machine = this.selectedMachine.id
        ? this.selectedMachine
        : null;
      console.log(this.newExercise);
      this.exerciseService.create(this.newExercise).subscribe((result) => {
        if (result) {
          this.messageService.add({
            severity: 'success',
            detail: 'Siker!',
            summary: 'Sikeres mentés!',
          });
          this.newExerciseDialog = false;
          this.fetchData();
        } else {
          this.messageService.add({
            severity: 'error',
            detail: 'Hiba!',
            summary: 'Nem sikerült a mentés!',
          });
          this.newExercise = {
            machine: {},
          };
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        detail: 'Hiba!',
        summary:
          'Hibás adatok! A következő adatokpárokból egyet, és csak egyet kell megadnia: súly-ismétlés / intenzitás-időtartam!',
      });
    }
  }

  public hideNewDialog() {
    this.newExerciseDialog = false;
    this.newExercise = {
      machine: {},
    };
  }
}

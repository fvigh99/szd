import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ExerciseService } from 'libs/data-access/exercise/exercise.service';
import { Observable } from 'rxjs';
import { Exercise, Machine, User } from 'libs/model/FcServerModel';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
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
  public machineList: Machine[];
  public selectedMachine: Machine;
  public filteredMachines: Machine[] | undefined;
  public loggedInUser: User;
  public maxDate: Date | undefined;
  constructor(
    private exerciseService: ExerciseService,
    private messageService: MessageService,
    private machineService: MachineService,
    private accountService: AccountService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit(): void {
    /* this.loggedInUser = this.accountService.userValue.user_object; */
    this.loggedInUser = this.accountService.userValue?.user_object;
    this.fetchData();
    this.machineService.fetch().subscribe((result) => {
      this.machineList = result as Machine[];
    });
  }

  public fetchData() {
    this.exerciseList = this.exerciseService.getExerciseByUserId(
      this.loggedInUser?.id
    );
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
      (this.newExercise.weight &&
        this.newExercise.count &&
        !this.newExercise.intensity &&
        !this.newExercise.duration) ||
      (this.newExercise.intensity &&
        this.newExercise.duration &&
        !this.newExercise.weight &&
        !this.newExercise.count)
    ) {
      this.newExercise.user = this.loggedInUser;
      this.newExercise.machine = this.selectedMachine?.id
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
          this.selectedMachine = {};
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        detail:
          'Hibás adatok! A következő adatokpárokból egyet, és csak egyet kell megadnia: súly-ismétlés / intenzitás-időtartam!',
        summary: 'Hiba',
        life: 8000,
      });
    }
  }

  public hideNewDialog() {
    this.newExerciseDialog = false;
    this.newExercise = {
      machine: {},
    };
    this.selectedMachine = {};
  }

  public deleteExercise(exercise: Exercise) {
    this.confirmationService.confirm({
      message: 'Biztosan törölni szeretné az edzést?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => {
        this.exerciseService
          .delete(exercise.id)
          .subscribe((result) => {
            this.messageService.add({
              severity: 'success',
              detail: 'Siker!',
              summary: 'Sikeres törlés!',
            });
          })
          .add(() => {
            this.fetchData();
          });
      },
    });
  }

  public machineChanged() {
    this.newExercise = {};
  }
}

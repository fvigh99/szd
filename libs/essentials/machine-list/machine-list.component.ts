import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { MachineService } from 'libs/data-access/machine/machine.service';
import { Observable } from 'rxjs';
import { Machine, User } from 'libs/model/FcServerModel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AccountService } from 'libs/data-access/account/account.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'fc-machine-list',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    ButtonModule,
    NgIf,
    AsyncPipe,
    ToastModule,
    ToolbarModule,
    DialogModule,
    InputTextareaModule,
    FormsModule,
    InputTextModule,
    ConfirmDialogModule,
  ],
  templateUrl: './machine-list.component.html',
  styleUrl: './machine-list.component.scss',
})
export class MachineListComponent implements OnInit {
  public loggedInUser: User;
  public machineList: Observable<Machine>;
  public newMachineDialog = false;
  public editMachineDialog = false;
  public newMachine: Machine;
  public editedMachine: Machine;

  constructor(
    private machineService: MachineService,
    private messageService: MessageService,
    private accountService: AccountService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.fetchData();
    this.loggedInUser = this.accountService.userValue?.user_object;
    console.log(this.loggedInUser);
  }

  public fetchData() {
    this.machineList = this.machineService.fetch();
  }

  public imageClicked(value: Machine) {
    this.editMachineDialog = true;
    this.editedMachine = value;
  }

  public openNew() {
    this.newMachineDialog = true;
    this.newMachine = {};
  }

  public hideNewDialog() {
    this.newMachineDialog = false;
    this.newMachine = {};
  }

  public saveNewMachine() {
    this.machineService.create(this.newMachine).subscribe((result) => {
      if (result) {
        this.messageService.add({
          severity: 'success',
          detail: 'Siker!',
          summary: 'Sikeres mentés!',
        });
        this.newMachineDialog = false;
        this.fetchData();
      } else {
        this.messageService.add({
          severity: 'error',
          detail: 'Hiba!',
          summary: 'Nem sikerült a mentés!',
        });
        this.newMachine = {};
      }
    });
  }

  public hideEditedDialog() {
    this.fetchData();
    this.editMachineDialog = false;
  }

  public saveEditedMachine() {
    this.machineService.save(this.editedMachine).subscribe((result) => {
      if (result) {
        this.messageService.add({
          severity: 'success',
          detail: 'Siker!',
          summary: 'Sikeres mentés!',
        });
        this.fetchData();
        this.editMachineDialog = false;
      } else {
        this.messageService.add({
          severity: 'error',
          detail: 'Hiba!',
          summary: 'Nem sikerült a mentés!',
        });
      }
    });
  }

  public deleteMachine() {
    this.confirmationService.confirm({
      message: 'Biztosan törölni szeretné a gépet?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => {
        this.machineService
          .delete(this.editedMachine.id)
          .subscribe((result) => {
            if (result) {
              this.messageService.add({
                severity: 'success',
                detail: 'Siker!',
                summary: 'Sikeres törlés!',
              });
              this.editMachineDialog = false;
              this.fetchData();
            } else {
              this.messageService.add({
                severity: 'error',
                detail: 'Hiba!',
                summary: 'Nem sikerült a törlés!',
              });
            }
          });
      },
    });
  }
}

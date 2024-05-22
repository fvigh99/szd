import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { MachineService } from 'libs/data-access/machine/machine.service';
import { Observable } from 'rxjs';
import { FileUploadResult, Machine, User } from 'libs/model/FcServerModel';
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
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { HttpResponse } from '@angular/common/http';

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
    DropdownModule,
    FileUploadModule,
  ],
  templateUrl: './machine-list.component.html',
  styleUrl: './machine-list.component.scss',
})
export class MachineListComponent implements OnInit {
  public loggedInUser: User;
  public machineList: Observable<Machine[]>;
  public newMachineDialog = false;
  public editMachineDialog = false;
  public newMachine: Machine;
  public editedMachine: Machine;
  public typeList: string[] = ['Súlyzós', 'Kardió'];

  constructor(
    private machineService: MachineService,
    private messageService: MessageService,
    private accountService: AccountService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.fetchData();
    this.loggedInUser = this.accountService.userValue?.user_object;
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
    if (this.newMachine.picture) {
      this.machineService.create(this.newMachine).subscribe((result) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Siker!',
          detail: 'Sikeres mentés!',
        });
        this.newMachineDialog = false;
        this.fetchData();
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Hiba!',
        detail: 'Sikertelen mentés! Nem töltött fel képet a géphez!',
      });
    }
  }

  public hideEditedDialog() {
    this.fetchData();
    this.editMachineDialog = false;
  }

  public saveEditedMachine() {
    if (this.editedMachine.picture) {
      this.machineService.save(this.editedMachine).subscribe((result) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Siker!',
          detail: 'Sikeres mentés!',
        });
        this.fetchData();
        this.editMachineDialog = false;
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Hiba!',
        detail: 'Sikertelen mentés! Nem töltött fel képet a géphez!',
      });
    }
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
            this.messageService.add({
              severity: 'success',
              summary: 'Siker!',
              detail: 'Sikeres törlés!',
            });
            this.editMachineDialog = false;
            this.fetchData();
          });
      },
    });
  }

  public uploadHandler(event: FileUploadEvent, machine: Machine) {
    let result = event.originalEvent as HttpResponse<FileUploadResult>;
    machine.picture = result.body.data;
    this.messageService.add({
      severity: 'success',
      summary: 'Siker!',
      detail: 'Kép sikeresen feltöltve!',
    });
  }

  public removePicture(machine: Machine) {
    this.confirmationService.confirm({
      message:
        'Biztosan el szeretné távolítani a képet? Amennyiben igen, töltsön fel utána újat!',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => {
        machine.picture = null;
      },
    });
  }
}

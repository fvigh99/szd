import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { UserService } from 'libs/data-access/user/user.service';
import { FileUploadResult, Pass, User } from 'libs/model/FcServerModel';
import { Observable } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { AccountService } from 'libs/data-access/account/account.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PassService } from 'libs/data-access/pass/pass.service';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { HttpResponse } from '@angular/common/http';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'fc-user-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    AsyncPipe,
    DropdownModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    DropdownModule,
    InputTextareaModule,
    InputTextModule,
    DatePipe,
    AutoCompleteModule,
    FileUploadModule,
    ConfirmDialogModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  public userList: Observable<User>;
  public passList: any;
  public filteredPasses: Pass[];
  public roleList: string[] = ['TAG', 'EDZO', 'ADMIN'];
  public loggedInUser: User | null;
  public rowEditing = false;
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private accountService: AccountService,
    private passService: PassService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit(): void {
    this.fetchUsers();
    this.fetchPasses();
    this.loggedInUser = this.accountService.userValue?.user_object;
  }

  public fetchUsers(): void {
    this.userList = this.userService.fetch();
  }

  public onRowEditInit(editedUser: User) {
    this.rowEditing = true;
  }

  public onRowEditSave(editedUser: User) {
    if (editedUser.role === 'EDZO' && !editedUser.picture) {
      this.messageService.add({
        severity: 'error',
        summary: 'Hiba!',
        detail:
          'Sikertelen módosítás! Edzőnek kötelező profilképet is feltölteni!',
      });
      this.rowEditing = false;
      this.fetchUsers();
    } else {
      this.userService
        .save(editedUser)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Siker!',
            detail: 'Sikeres módosítás!',
          });
          this.rowEditing = false;
        })
        .add(() => {
          this.fetchUsers();
        });
    }
  }

  public onRowEditCancel(editedUser: User, rowIndex: number) {
    this.rowEditing = false;
    this.fetchUsers();
  }

  public fetchPasses(): void {
    this.passService.fetch().subscribe((result) => {
      this.passList = result;
    });
  }

  public uploadHandler(event: FileUploadEvent, user: User) {
    let result = event.originalEvent as HttpResponse<FileUploadResult>;
    console.log(result.body.data);
    user.picture = result.body.data;
    this.messageService.add({
      severity: 'success',
      summary: 'Siker!',
      detail: 'Profilkép sikeresen feltöltve!',
    });
  }

  public removeProfilePicture(user: User) {
    this.confirmationService.confirm({
      message:
        'Biztosan el szeretné távolítani az edző profilképét? Amennyiben igen, töltsön fel utána új profilképet!',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => {
        user.picture = null;
      },
    });
  }
}

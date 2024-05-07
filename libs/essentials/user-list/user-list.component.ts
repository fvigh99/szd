import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { UserService } from 'libs/data-access/user/user.service';
import { User } from 'libs/model/FcServerModel';
import { Observable } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { AccountService } from 'libs/data-access/account/account.service';

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
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  public userList: Observable<User>;
  public filteredRoles: string[];
  public roleList: string[] = ['TAG', 'EDZO', 'ADMIN'];
  public loggedInUser: User | null;
  public rowEditing = false;
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private accountService: AccountService
  ) {}
  ngOnInit(): void {
    this.userList = this.userService.fetch();
    this.loggedInUser = this.accountService.userValue?.user_object;
  }

  public onRowEditInit(editedUser: User) {
    this.rowEditing = true;
  }

  public onRowEditSave(editedUser: User) {
    this.userService.save(editedUser).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Siker!',
        detail: 'Sikeres módosítás!',
      });
      this.rowEditing = false;
    });
  }

  public onRowEditCancel(editedUser: User, rowIndex: number) {
    this.rowEditing = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { UserService } from 'libs/data-access/user/user.service';
import { User } from 'libs/model/FcServerModel';
import { Observable } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  public userList: Observable<User>;
  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.userList = this.userService.fetch();
  }

  public onRowEditInit(editedUser: User) {}

  public onRowEditSave(editedUser: User) {
    this.userService.save(editedUser).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Siker!',
        detail: 'Sikeres módosítás!',
      });
    });
  }

  public onRowEditCancel(editedUser: User, rowIndex: number) {}
}

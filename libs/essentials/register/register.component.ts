import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AccountService } from 'libs/data-access/account/account.service';
import { Router } from '@angular/router';
import { User } from 'libs/model/FcServerModel';
import { UserService } from 'libs/data-access/user/user.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'fc-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, ToastModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public registeredUser: User = {};
  public loading = false;
  @Output() public backToLogin: EventEmitter<boolean> = new EventEmitter();
  @Output() public successfulRegister: EventEmitter<boolean> =
    new EventEmitter();
  constructor(
    private accountService: AccountService,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  public register(): void {
    (this.registeredUser.role = 'TAG'),
      this.userService
        .create(this.registeredUser)
        .subscribe((result) => {
          if (result) {
            this.messageService.add({
              severity: 'success',
              summary: 'Siker!',
              detail: 'Sikeres regisztráció!',
            });
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
              this.successfulRegister.emit(true);
            }, 2000);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Hiba!',
              detail: 'A felhasználónév már foglalt!',
            });
          }
        })
        .add(() => {
          this.registeredUser = {};
        });
  }

  public cancel(): void {
    this.backToLogin.emit(false);
    this.registeredUser = {};
  }
}

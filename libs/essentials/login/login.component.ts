import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AccountService } from 'libs/data-access/account/account.service';
import { User } from 'libs/model/FcServerModel';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'fc-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    RegisterComponent,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;
  public loggedInUser: User | null = null;
  public register: boolean = false;
  @Output() public loginStatusChanged: EventEmitter<User | null> =
    new EventEmitter();
  @Output() public loginOver: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  public login(): void {
    this.accountService
      .login(this.username, this.password)
      .subscribe((returnValue) => {
        if (returnValue.message) {
          this.messageService.add({
            summary: 'Hiba!',
            severity: 'error',
            detail: returnValue.message,
          });
        } else {
          this.loggedInUser = this.accountService.userValue?.user_object;
          this.messageService.add({
            summary: 'Siker!',
            severity: 'success',
            detail: 'Sikeres bejelentkezés! Átirányítunk a főoldalra.',
          });
          setTimeout(() => {
            this.loginStatusChanged.emit(this.loggedInUser);
          }, 3000);
        }
      })
      .add(() => {});
  }

  public logout(): void {
    this.accountService.logout();
    this.loginStatusChanged.emit(null);
    this.loggedInUser = null;
  }

  public navigateToRegister(): void {
    this.register = true;
    this.username = null;
    this.password = null;
  }

  public navigateToForgottenPW(): void {}

  public registerOver(value: boolean): void {
    this.register = value;
  }

  public navigateToHomePage(): void {
    this.loginOver.emit(true);
  }
}

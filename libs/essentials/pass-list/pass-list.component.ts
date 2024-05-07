import { Component, OnInit, ɵgetAsyncClassMetadataFn } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule } from '@angular/forms';
import { PassService } from 'libs/data-access/pass/pass.service';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { Pass, User } from 'libs/model/FcServerModel';
import { AccountService } from 'libs/data-access/account/account.service';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from 'libs/data-access/user/user.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'fc-pass-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    ToolbarModule,
    FormsModule,
    AsyncPipe,
    ToastModule,
    ButtonModule,
    CheckboxModule,
    InputNumberModule,
    InputTextModule,
    ConfirmDialogModule,
  ],
  templateUrl: './pass-list.component.html',
  styleUrl: './pass-list.component.scss',
})
export class PassListComponent implements OnInit {
  public passList: Observable<Pass>;
  public loggedInUser: User;
  public newPassDialog = false;
  public newPass: Pass;
  constructor(
    private passService: PassService,
    private accountService: AccountService,
    private messageService: MessageService,
    private userService: UserService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.accountService.userValue?.user_object;
    this.fetchData();
  }

  public fetchData() {
    this.passList = this.passService.fetch();
  }

  public onRowEditInit(editedPass: Pass) {}

  public onRowEditSave(editedPass: Pass) {
    this.passService.save(editedPass).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Siker!',
        detail: 'Sikeres módosítás!',
      });
    });
  }

  public onRowEditCancel(editedPass: Pass, rowIndex: number) {}

  public openNew() {
    this.newPassDialog = true;
    this.newPass = {};
  }

  public hideNewDialog() {
    this.newPassDialog = false;
    this.newPass = {};
  }

  public saveNewPass() {
    this.passService.create(this.newPass).subscribe((result) => {
      if (result) {
        this.messageService.add({
          severity: 'success',
          detail: 'Siker!',
          summary: 'Sikeres mentés!',
        });
        this.newPassDialog = false;
        this.fetchData();
      } else {
        this.messageService.add({
          severity: 'error',
          detail: 'Hiba!',
          summary: 'Nem sikerült a mentés!',
        });
        this.newPass = {};
      }
    });
  }

  public buyPass(pass: Pass) {
    this.confirmationService.confirm({
      message: 'Biztosan meg szeretné vásárolni a bérletet?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => {
        let userWithPass: User;
        this.userService
          .getById(this.loggedInUser.id)
          .pipe(
            map((user) => {
              return user.pass ? null : user;
            }),
            switchMap((user) => {
              if (user) {
                Object.assign(userWithPass, user);
                userWithPass.pass = pass;
                return this.userService.save(userWithPass);
              } else {
                let returnedValue;
                this.confirmationService.confirm({
                  message: 'Van érvényes bérlete! Szeretné lecserélni?',
                  header: 'Figyelmeztetés',
                  icon: 'pi pi-exclamation-triangle',
                  acceptLabel: 'Igen',
                  rejectLabel: 'Nem',
                  accept: () => {
                    returnedValue = user;
                  },
                  reject: () => {
                    returnedValue = of(null);
                  },
                });
                return returnedValue;
              }
            })
          )
          .subscribe((result) => {
            if (result) {
              this.messageService.add({
                severity: 'success',
                detail: 'Siker!',
                summary: 'Sikeres vásárlás!',
              });
              this.fetchData();
            } else {
              this.messageService.add({
                severity: 'error',
                detail: 'Hiba!',
                summary: 'Sikertelen vásárlás! Már van aktív bérlete.',
              });
            }
          });
      },
    });
  }
}

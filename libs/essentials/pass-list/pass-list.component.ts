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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';

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
    FaIconComponent,
  ],
  templateUrl: './pass-list.component.html',
  styleUrl: './pass-list.component.scss',
})
export class PassListComponent implements OnInit {
  public passList: Observable<Pass>;
  public loggedInUser: User;
  public newPassDialog = false;
  public newPass: Pass;
  public currentPass: Pass | null;
  public faCheck = faCheck;
  public faX = faX;
  constructor(
    private passService: PassService,
    private accountService: AccountService,
    private messageService: MessageService,
    private userService: UserService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    /* this.loggedInUser = this.accountService.userValue?.user_object; */
    this.accountService.user.subscribe((value) => {
      if (value && value.user_object) {
        this.loggedInUser = value.user_object;
      } else {
        this.loggedInUser = null;
      }
    });
    this.fetchData();
  }

  public fetchData() {
    this.passList = this.passService.fetch();
    if (this.loggedInUser) {
      this.userService.getById(this.loggedInUser?.id).subscribe((result) => {
        this.currentPass = result.pass;
      });
    }
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
        this.userService
          .getById(this.loggedInUser?.id)
          .pipe(
            switchMap((user) => {
              let userWithPass = user;
              userWithPass.pass = pass;
              return this.userService.save(userWithPass);
            })
          )
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              detail: 'Siker!',
              summary: 'Sikeres vásárlás!',
            });
          })
          .add(() => {
            this.fetchData();
          });
      },
    });
  }

  public deletePass() {
    this.confirmationService.confirm({
      message: 'Biztosan törölni szeretné az aktív bérletét?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => {
        this.userService
          .getById(this.loggedInUser?.id)
          .pipe(
            switchMap((user) => {
              let userWithPass = user;
              userWithPass.pass = null;
              return this.userService.save(userWithPass);
            })
          )
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              detail: 'Siker!',
              summary: 'Bérlet törlése sikeres!',
            });
          })
          .add(() => {
            this.fetchData();
          });
      },
    });
  }
}

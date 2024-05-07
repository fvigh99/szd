import { Component, OnInit, ɵgetAsyncClassMetadataFn } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule } from '@angular/forms';
import { PassService } from 'libs/data-access/pass/pass.service';
import { Observable } from 'rxjs';
import { Pass, User } from 'libs/model/FcServerModel';
import { AccountService } from 'libs/data-access/account/account.service';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

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
  ],
  templateUrl: './pass-list.component.html',
  styleUrl: './pass-list.component.scss',
})
export class PassListComponent implements OnInit {
  public passList: Observable<Pass>;
  public loggedInUser: User | null;
  public newPassDialog = false;
  public newPass: Pass;
  constructor(
    private passService: PassService,
    private accountService: AccountService,
    private messageService: MessageService
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
}

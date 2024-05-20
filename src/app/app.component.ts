import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabmenuComponent } from '../../libs/essentials/tabmenu/tabmenu.component';
import { NgIf } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ContactComponent } from 'libs/essentials/contact/contact.component';
import { AccountService } from 'libs/data-access/account/account.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgbModule, TabmenuComponent, NgIf, ContactComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class AppComponent implements OnInit {
  public loginPage = false;
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {}

  public loginChanged(value: boolean) {
    this.loginPage = value;
  }
}

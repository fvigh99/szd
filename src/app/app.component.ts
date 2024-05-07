import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabmenuComponent } from '../../libs/essentials/tabmenu/tabmenu.component';
import { NgIf } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ContactComponent } from 'libs/essentials/contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgbModule, TabmenuComponent, NgIf, ContactComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class AppComponent {
  public loginPage = false;

  public loginChanged(value: boolean) {
    this.loginPage = value;
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'libs/model/FcServerModel';
import { AccountService } from 'libs/data-access/account/account.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'fc-tabmenu',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    TabMenuModule,
    FormsModule,
    ButtonModule,
  ],
  templateUrl: './tabmenu.component.html',
  styleUrl: './tabmenu.component.scss',
})
export class TabmenuComponent implements OnInit {
  public items: MenuItem[] = [];
  public activeItem: MenuItem | undefined;
  public userAccount: User = {};
  public login = false;
  @Output() public loginInProgress: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.setMenuItems();
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['page']) {
        this.activeItem = this.items.find(
          (menuItem) => menuItem.title === params['page']
        );
      } else {
        this.activeItem = this.items[0];
      }
    });
  }

  public setMenuItems(): void {
    this.items = [
      {
        title: 'home',
        label: 'Főoldal',
        disabled: this.login,
      },
      {
        title: 'trainer-list',
        label: 'Edzők elérése',
        disabled: this.login,
        visible: this.userAccount.role !== 'EDZO',
      },
      {
        title: 'machine-list',
        label: 'Gépek elérése',
        disabled: this.login,
        visible: this.userAccount.role !== 'EDZO',
      },
      {
        title: 'previous-exercises',
        label: 'Előző edzéseim',
        disabled: this.login,
        visible: this.userAccount.role === 'TAG',
      },
      {
        title: 'achievements',
        label: 'Teljesítmények',
        disabled: this.login,
        visible: this.userAccount.role === 'TAG',
      },
      {
        title: 'user-list',
        label: 'Felhasználók',
        disabled: this.login,
        visible: this.userAccount.role === 'ADMIN',
      },
      {
        title: 'my-schedule',
        label: 'Órarendem',
        disabled: this.login,
        visible: this.userAccount.role === 'EDZO',
      },
    ];
  }

  public onActiveItemChange(dataItem: MenuItem) {
    this.router.navigate(['/page/', dataItem.title]);
  }

  public checkLoginStatus(value: User | null) {
    this.userAccount = value;
    console.log(this.userAccount);
    if (value) {
      this.login = false;
      this.loginInProgress.emit(false);
    }
    this.setMenuItems();
  }

  public navigateToLogin(): void {
    this.login = true;
    this.setMenuItems();
    this.loginInProgress.emit(true);
  }

  public loginOver(): void {
    this.login = false;
    this.setMenuItems();
    this.loginInProgress.emit(false);
  }

  public logout(): void {
    this.router.navigate(['/page/home']);
    this.userAccount = {};
    this.accountService.logout();
    this.setMenuItems();
  }
}

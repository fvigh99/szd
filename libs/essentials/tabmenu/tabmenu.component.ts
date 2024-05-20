import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'libs/model/FcServerModel';
import { AccountService } from 'libs/data-access/account/account.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'fc-tabmenu',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    MenubarModule,
    FormsModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './tabmenu.component.html',
  styleUrl: './tabmenu.component.scss',
})
export class TabmenuComponent implements OnInit {
  public items: MenuItem[] = [];
  public activeItem: MenuItem | undefined;
  public loggedInUser: User;
  public login = false;
  public loading = false;
  @Output() public loginInProgress: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.accountService.userValue.subscribe((user) => {
      this.loggedInUser = user?.user_object;
    });
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
        disabled: this.login || this.loading,
        command: () => this.navigate('home'),
      },
      {
        title: 'trainer-list',
        label: 'Edzők',
        disabled: this.login || this.loading,
        visible: this.loggedInUser?.role !== 'EDZO',
        command: () => this.navigate('trainer-list'),
      },
      {
        title: 'machine-list',
        label: 'Gépek',
        disabled: this.login || this.loading,
        visible: this.loggedInUser?.role !== 'EDZO',
        command: () => this.navigate('machine-list'),
      },
      {
        title: 'previous-exercises',
        label: 'Előző edzéseim',
        disabled: this.login || this.loading,
        visible: this.loggedInUser?.role === 'TAG',
        command: () => this.navigate('previous-exercises'),
      },
      {
        title: 'achievements',
        label:
          this.loggedInUser && this.loggedInUser?.role === 'TAG'
            ? 'Teljesítményeim'
            : 'Teljesítmények',
        disabled: this.login || this.loading,
        visible:
          this.loggedInUser?.role === 'TAG' ||
          this.loggedInUser?.role === 'ADMIN',
        command: () => this.navigate('achievements'),
      },
      {
        title: 'user-list',
        label: 'Felhasználók',
        disabled: this.login || this.loading,
        visible: this.loggedInUser?.role === 'ADMIN',
        command: () => this.navigate('user-list'),
      },
      {
        title: 'my-schedule',
        label: 'Órarendem',
        disabled: this.login || this.loading,
        visible: this.loggedInUser?.role === 'EDZO',
        command: () => this.navigate('my-schedule'),
      },
      {
        title: 'pass-list',
        label: 'Bérletek',
        disabled: this.login || this.loading,
        command: () => this.navigate('pass-list'),
      },
    ];
  }

  public onActiveItemChange(dataItem: MenuItem) {
    this.router.navigate(['/page/', dataItem.title]);
  }

  public checkLoginStatus(value: User | null) {
    this.loggedInUser = value;
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
    this.loading = true;
    this.messageService.add({
      summary: 'Információ!',
      severity: 'info',
      detail: 'Sikeres kijelentkezés! Átirányítunk a főoldalra.',
    });
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/page/home']);
      this.loggedInUser = {};
      this.accountService.logout();
      this.setMenuItems();
    }, 2000);
  }

  public navigate(page: string) {
    this.router.navigate(['/page/' + page]);
  }

  activeMenu(event: any) {
    let node;
    if (event.target.tagName === 'A') {
      node = event.target;
    } else {
      node = event.target.parentNode;
    }
    let menuitem = document.getElementsByClassName('ui-menuitem-link');
    for (let i = 0; i < menuitem.length; i++) {
      menuitem[i].classList.remove('active');
    }
    node.classList.add('active');
  }
}

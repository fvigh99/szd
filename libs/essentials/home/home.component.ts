import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'libs/data-access/user/user.service';
import { AccountService } from 'libs/data-access/account/account.service';

@Component({
  selector: 'fc-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(
    private userService: UserService,
    private accountService: AccountService
  ) {}
  public ngOnInit(): void {
    /* console.log(this.accountService.userValue?.user_object); */
  }
}

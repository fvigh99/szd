import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AccountService } from 'libs/data-access/account/account.service';
import { AchievementService } from 'libs/data-access/achievement/achievement.service';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import {
  Achievement,
  FileUploadResult,
  Machine,
  User,
} from 'libs/model/FcServerModel';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MachineService } from 'libs/data-access/machine/machine.service';
import { Observable } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { HttpResponse } from '@angular/common/http';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    TableModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    DropdownModule,
    ConfirmDialogModule,
    InputNumberModule,
    ToolbarModule,
    InputTextareaModule,
    FileUploadModule,
    ConfirmDialogModule,
    CarouselModule,
    ButtonModule,
    AsyncPipe,
  ],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss',
})
export class AchievementsComponent implements OnInit {
  public addAchievementDialog = false;
  public editAchievementDialog = false;
  public loggedInUser: User | undefined;
  public editedAchievement: Achievement;
  public achievementTypeList: string[] = ['Egyéni', 'Csoportos'];
  public machineList: Machine[];
  public achievementList: Observable<Achievement[]>;
  public groupTrainingTypeList: Array<string> = [
    'kickbox',
    'spinracing',
    'pilates',
    'yoga',
  ];
  public newAchievement: Achievement;
  public newAchievementDialog = false;
  constructor(
    private accountService: AccountService,
    private achievementService: AchievementService,
    private machineService: MachineService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.accountService.userValue?.user_object;
    this.machineService.fetch().subscribe((result) => {
      this.machineList = result as Machine[];
    });
    this.fetchData();
  }

  public openNew(): void {
    this.newAchievementDialog = true;
    this.newAchievement = {};
  }

  public fetchData(): void {
    this.achievementList = this.achievementService.fetch();
  }

  public openEditedDialog(achievement: Achievement): void {
    this.editAchievementDialog = true;
    this.editedAchievement = achievement;
  }

  public hideEditedDialog(): void {
    this.editAchievementDialog = false;
    this.editedAchievement = null;
    this.fetchData();
  }

  public saveEditedAchievement(): void {
    this.achievementService.save(this.editedAchievement).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Siker!',
        detail: 'Kitűző sikeresen módosítva!',
      });
      this.editAchievementDialog = false;
      this.editedAchievement = null;
      this.fetchData();
    });
  }

  public deleteAchievement() {
    this.confirmationService.confirm({
      message: 'Biztosan törölni szeretné a kitűzőt?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => {
        this.achievementService
          .delete(this.editedAchievement.id)
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Siker!',
              detail: 'Kitűző sikeresen törölve!',
            });
            this.editAchievementDialog = false;
            this.editedAchievement = null;
            this.fetchData();
          });
      },
    });
  }

  public hideNewDialog(): void {
    this.newAchievementDialog = false;
    this.newAchievement = null;
  }

  public saveNewAchievement(): void {
    if (this.newAchievement.icon) {
      this.achievementService.create(this.newAchievement).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Siker!',
          detail: 'Új kitűző sikeresen elmentve!',
        });
        this.newAchievementDialog = false;
        this.newAchievement = null;
        this.fetchData();
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Hiba!',
        detail: 'Nem adott meg ikont a kitűzőnek!',
      });
    }
  }

  public uploadHandler(event: FileUploadEvent, achievement: Achievement) {
    let result = event.originalEvent as HttpResponse<FileUploadResult>;
    achievement.icon = result.body.data;
    this.messageService.add({
      severity: 'success',
      summary: 'Siker!',
      detail: 'Ikon sikeresen feltöltve!',
    });
  }

  public removeIcon(achievement: Achievement) {
    this.confirmationService.confirm({
      message:
        'Biztosan el szeretné távolítani a kitűző ikonját? Amennyiben igen, töltsön fel utána új ikont!',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => {
        achievement.icon = null;
      },
    });
  }
}

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
  EarnedAchievement,
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
import { Observable, tap } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { HttpResponse } from '@angular/common/http';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { EarnedAchievementService } from 'libs/data-access/earned-achievement/earned-achievement.service';

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
  public earnedAchievementList: Observable<EarnedAchievement[]>;
  public groupTrainingTypeList: Array<string> = [
    'kickbox',
    'spinracing',
    'pilates',
    'yoga',
  ];
  public newAchievement: Achievement;
  public newAchievementDialog = false;
  public earnedAchievementCount = -1;
  public availableAchievements: Achievement[];
  constructor(
    private accountService: AccountService,
    private achievementService: AchievementService,
    private earnedAchievementService: EarnedAchievementService,
    private machineService: MachineService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.accountService.userValue?.user_object;
    this.machineService.getByFlag('A').subscribe((result) => {
      this.machineList = result;
    });
    this.fetchData();
  }

  public openNew(): void {
    this.newAchievementDialog = true;
    this.newAchievement = {};
  }

  public fetchData(): void {
    this.achievementList = this.achievementService.fetch();
    if (this.loggedInUser && this.loggedInUser?.role === 'TAG') {
      this.earnedAchievementList =
        this.earnedAchievementService.getEarnedAchievementByUserId(
          this.loggedInUser.id
        );
      this.earnedAchievementService
        .getEarnedAchievementByUserId(this.loggedInUser.id)
        .subscribe((result) => {
          this.earnedAchievementCount = result.length;
        });
    }
    this.achievementService.fetch().subscribe((result) => {
      this.availableAchievements = result;
    });
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
    if (this.editedAchievement.icon) {
      if (
        !this.editedAchievement.machine?.id &&
        this.editedAchievement.type === 'Egyéni'
      ) {
        this.messageService.add({
          severity: 'error',
          summary: 'Hiba!',
          detail: 'Nem adta meg a használt gépet!',
        });
      } else {
        this.availableAchievements = this.availableAchievements.filter(
          (achievement) => achievement.id !== this.editedAchievement.id
        );
        if (
          (this.editedAchievement.machine?.id &&
            this.availableAchievements.find(
              (achievement) =>
                achievement.machine?.id === this.editedAchievement.machine?.id
            )) ||
          (this.editedAchievement.typeOfGroupTraining &&
            this.availableAchievements.find(
              (achievement) =>
                achievement.typeOfGroupTraining ===
                this.editedAchievement.typeOfGroupTraining
            ))
        ) {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiba!',
            detail:
              'Ilyen típusú kitűző már létezik! (használt gép / csoportos edzés típusa)',
          });
        } else {
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
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Hiba!',
        detail: 'Nem töltött fel új ikont a kitűzőnek!',
      });
    }
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
      if (
        !this.newAchievement.machine?.id &&
        this.newAchievement.type === 'Egyéni'
      ) {
        this.messageService.add({
          severity: 'error',
          summary: 'Hiba!',
          detail: 'Nem adta meg a használt gépet!',
        });
      } else {
        if (
          (this.newAchievement.machine?.id &&
            this.availableAchievements.find(
              (achievement) =>
                achievement.machine?.id === this.newAchievement.machine?.id
            )) ||
          (this.newAchievement.typeOfGroupTraining &&
            this.availableAchievements.find(
              (achievement) =>
                achievement.typeOfGroupTraining ===
                this.newAchievement.typeOfGroupTraining
            ))
        ) {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiba!',
            detail:
              'Ilyen típusú kitűző már létezik! (használt gép / csoportos edzés típusa)',
          });
        } else {
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
        }
      }
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

  public typeChanged(value: string, achievement: Achievement) {
    if (value === 'Egyéni') {
      achievement.typeOfGroupTraining = null;
      achievement.eventCount = null;
      achievement.machine = {};
    } else {
      achievement.machine = null;
      achievement.duration = null;
      achievement.intensity = null;
      achievement.repetitionCount = null;
      achievement.weight = null;
    }
  }

  public machineChanged(value: Machine, achievement: Achievement) {
    if (value) {
      if (value.type === 'Súlyzós') {
        achievement.intensity = null;
        achievement.duration = null;
      } else {
        achievement.weight = null;
        achievement.repetitionCount = null;
      }
    } else {
      achievement.machine = {};
      achievement.weight = null;
      achievement.repetitionCount = null;
      achievement.intensity = null;
      achievement.duration = null;
    }
  }
}

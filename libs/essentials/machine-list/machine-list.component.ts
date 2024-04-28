import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'fc-machine-list',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule
  ],
  templateUrl: './machine-list.component.html',
  styleUrl: './machine-list.component.scss',
})
export class MachineListComponent {
  public machineList: any[] = [];
}

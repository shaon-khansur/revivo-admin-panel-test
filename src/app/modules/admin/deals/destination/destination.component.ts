import { Component } from '@angular/core';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import { CdkDragDrop, CdkDrag, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { RouterLink, RouterOutlet} from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DestinationService } from './service/destination.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AddDestinationComponent } from './add-destination/add-destination.component';


@Component({
  selector: 'app-destination',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, NgFor, CdkDrag, 
    FormsModule, ReactiveFormsModule, CommonModule,
    RouterLink, RouterOutlet, MatSidenavModule,
    MatButtonModule, MatFormFieldModule,
    MatIconModule, MatInputModule, NgIf,
  ],
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.scss'],
})
export class DestinationComponent {

  form: FormGroup;
  showAddItemModal = false;
  destinationList: any = [];


  active = [];
  inactive = [];
  

  constructor(
    private destinationService: DestinationService, 
    private fb: FormBuilder,
    private dialog: MatDialog) {

    this.getAllDeals();
  }

  createDestination(): void {
    const dialgoConfig = new MatDialogConfig();
    this.dialog
        .open(AddDestinationComponent, dialgoConfig)
        .afterClosed()
        .subscribe((res) => {
            if (res) {
              this.getAllDeals();
            }
        });
}


drop(event: CdkDragDrop<string[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.updateOrder(event.container.data);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
    this.updateOrder(event.container.data);
    this.updateActiveState();
  }
}

  updateOrder(destinationList: string[]) {
    const updatedDestinations = destinationList.map((name, index, active) => ({
      name,
      index: Number(index + 1),
      active: this.active.includes(name),
      id: this.destinationList.find((item) => item.name === name)?.id,
    }));

    this.destinationService.bulkUpdateDeals(updatedDestinations).subscribe(
      (response) => {
      },
      (error) => {
      }
    );
  }

  updateActiveState() {
    const activeDestinations = this.active.map((name, index) => ({
      name,
      active: true,
      index: index + 1,
      id: this.destinationList.find((item) => item.name === name)?.id,
    }));
    const inactiveDestinations = this.inactive.map((name, index) => ({
      name,
      active: false,
      index: index + 1,
      id: this.destinationList.find((item) => item.name === name)?.id,
    }));
  
    const allDestinations = [...activeDestinations, ...inactiveDestinations];
  
    this.destinationService.bulkUpdateDeals(allDestinations).subscribe(
      (response) => {
      },
      (error) => {
      }
    );
  }  

  getAllDeals() {
    this.destinationService.getAllDeals().subscribe((res: any) => {
      this.destinationList = res.data;
      this.active = this.destinationList.filter((item: any) => item.active === true).map((item: any) => item.name);
      this.inactive = this.destinationList.filter((item: any) => item.active === false).map((item: any) => item.name);
    }, (err) => {
      console.log(err);
    });
  }

}

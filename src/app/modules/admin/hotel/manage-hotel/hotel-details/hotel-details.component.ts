import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material/sidenav';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.scss']
})
export class HotelDetailsComponent {
  @ViewChild(MatSidenav) drawer: MatSidenav | undefined;

  // Method to close the drawer if it's open
  closeDrawer(): Promise<void> {
    if (this.drawer && this.drawer.opened) {
      return this.drawer.close().then(() => {}); // Handle promise without returning a result
    }
    return Promise.resolve(); // Return a resolved promise if the drawer is not open
  }
}

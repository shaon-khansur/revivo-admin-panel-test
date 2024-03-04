import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddFareFamilyComponent } from '../add-fare-family/add-fare-family.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-fare-family-details',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    templateUrl: './fare-family-details.component.html',
    styleUrls: ['./fare-family-details.component.scss'],
})
export class FareFamilyDetailsComponent implements OnInit {
    constructor(private dialog: MatDialog) {}
    ngOnInit(): void {}
    add() {
        const dialogRef = this.dialog.open(AddFareFamilyComponent, {
            width: '800px',
            data: {}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log('Data received from dialog:', result);
            }
        });
    }
}

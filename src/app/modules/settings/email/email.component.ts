import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    MatPaginator,
    MatPaginatorModule,
    PageEvent,
} from '@angular/material/paginator';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import {
    MatDialog,
    MatDialogConfig,
    MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EmailService } from '../service/email.service';
import { MatSort } from '@angular/material/sort';
import { isArray } from 'lodash';
import { ShowHtmlComponent } from './show-html/show-html.component';

@Component({
    selector: 'app-email',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatCommonModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatPaginatorModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
    ],
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss'],
})
export class EmailComponent implements OnInit {
    emailService = inject(EmailService);
    page: number = 1;
    resultsLength = 100;
    displayedColumns: string[] = ['to', 'time', 'subject', 'status', 'view'];
    dataSource: MatTableDataSource<any[]>;
    allEmails: any[] = [];

    searchInputControl = new FormControl('');

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private dialog: MatDialog) {}

    ngOnInit(): void {
        this.emailService.getEmails(this.page).subscribe({
            next: (response: any) => {
                this.allEmails = response.data;
                this.dataSource = new MatTableDataSource(this.allEmails);
                this.resultsLength = response.totalItems;
            },
        });
    }

    onPageChange(event: PageEvent): void {
        this.page = event.pageIndex;
        // console.log('page event', event);
        this.emailService.getEmails(event.pageIndex).subscribe({
            next: (response: any) => {
                this.allEmails = response?.data;
                this.dataSource = new MatTableDataSource(this.allEmails);
                this.resultsLength = response.metadata.totalItems;
            },
        });
    }

    openDialog(data): void {
        const config = new MatDialogConfig();
        config.width = '100%';
        config.data = data;
        this.dialog
            .open(ShowHtmlComponent, config)
            .afterClosed()
            .subscribe((values) => {
                console.log('after closed', values);
            });
    }

    getEmailList(to: string[]): string {
        if (isArray(to)) {
            return to?.join(', ') || '';
        } else {
            return to || '';
        }
    }
}

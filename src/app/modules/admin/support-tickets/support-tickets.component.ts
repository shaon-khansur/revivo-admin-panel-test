import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {
    MatPaginator,
    MatPaginatorModule,
    PageEvent,
} from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { SupportTicketsService } from './support-tickets.service';
import { groupBy } from 'lodash';
import { debounceTime } from 'rxjs';
import { SupportTicketsDetailsComponent } from './support-tickets-details/support-tickets-details.component';

@Component({
    selector: 'app-support-tickets',
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
        MatSidenavModule,
        SupportTicketsDetailsComponent
    ],
    providers: [DatePipe],
    templateUrl: './support-tickets.component.html',
    styleUrls: ['./support-tickets.component.scss'],
})
export class SupportTicketsComponent implements OnInit {
    dataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    displayedColumns: string[] = ['name'];

    allSupporter: any[] = [];
    page: number = 1;
    pageSize: number = 10;
    resultsLength: number = 0;
    supportTicket: any;
    drawerMode: 'side' | 'over';

    searchInputControl = new FormControl('');
    constructor(
        private supportService: SupportTicketsService,
        private cdr: ChangeDetectorRef,
        private datePipe: DatePipe
    ) {}

    ngOnInit(): void {
        this.loadSupporter();

        this.searchInputControl.valueChanges
            .pipe(debounceTime(500))
            .subscribe((value) => {
                this.loadSupporter(value?.toLowerCase() || '');
            });

        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                this.supportTicket = null;
                this.cdr.markForCheck();
            }
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
    }

    // In the loadSubscribers method, after grouping by date:
    loadSupporter(searchValue: string = ''): void {
        this.supportService
            .getAllSupporter({
                page: this.page,
                name: searchValue,
                pageSize: this.pageSize,
            })
            .subscribe({
                next: (response) => {
                    const allSupporter = response.allData.map((supporter) => ({
                        ...supporter,
                        Date: new Date(supporter.Date),
                    }));
    
                    // Group supporters by date
                    const groupedByDate = groupBy(allSupporter, (supporter) =>
                        supporter.Date.toDateString()
                    );
    
                    // Sort dates in descending order and map to the desired format
                    this.allSupporter = Object.keys(groupedByDate)
                        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                        .map((date) => ({
                            date,
                            supporter: groupedByDate[date],
                        }));
    
                    // Set the data source
                    this.dataSource.data = this.allSupporter;
                    this.resultsLength = response.metadata.totalItems;
                    this.paginator?.firstPage();
                },
            });
    }
    

    onPageChange(event: PageEvent): void {
        this.page = event.pageIndex + 1; // Add 1 to align with 1-based indexing
        this.pageSize = event.pageSize;
        this.loadSupporter(this.searchInputControl.value?.toLowerCase() || '');
    }

    closeDrawer(): void {
        this.matDrawer.close();
    }

    onNameClick(subscriber: any): void {
        this.supportTicket = subscriber;
        this.matDrawer.open();
        this.updateStatus(subscriber.id);
    }

    updateStatus(id: string): void {
        // Implement your logic to update the status here
        this.supportService.updateStatus(id).subscribe(
            (response) => {
                this.loadSupporter(
                    this.searchInputControl.value?.toLowerCase() || ''
                );
            },
            (error) => {
                console.error('Error updating status:', error);
            }
        );
    }
    handleDelete(supporter: any): void {
        // Implement your logic to update the status here
        this.supportService.deleteSupporter(supporter.id).subscribe(
            (response) => {
                this.loadSupporter(
                    this.searchInputControl.value?.toLowerCase() || ''
                );
                this.matDrawer.close();
            },
            (error) => {
                console.error('Error updating status:', error);
            }
        );
    }
}

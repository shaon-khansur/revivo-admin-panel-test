import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
    MatPaginator,
    MatPaginatorModule,
    PageEvent,
} from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SubscriberService } from './subscriber.service';
import { debounceTime } from 'rxjs';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { SubscriberDrawerComponent } from './subscriber-drawer/subscriber-drawer.component';
import { groupBy } from 'lodash';
import { inject } from '@angular/core';
import { SendMailComponent } from './send-mail/send-mail.component';

@Component({
    selector: 'app-subscriber',
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
        SubscriberDrawerComponent,
    ],
    providers: [DatePipe],
    templateUrl: './subscriber.component.html',
    styleUrls: ['./subscriber.component.scss'],
})
export class SubscriberComponent implements OnInit {
    dataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    readonly dialog = inject(MatDialog);
    displayedColumns: string[] = ['name'];

    allSubscriber: any[] = [];
    page: number = 1;
    pageSize: number = 10;
    resultsLength: number = 0;
    selectedSubscriber: any;
    drawerMode: 'side' | 'over';

    searchInputControl = new FormControl('');
    constructor(
        private hotelService: SubscriberService,
        private cdr: ChangeDetectorRef,
        private datePipe: DatePipe
    ) {}

    ngOnInit(): void {
        this.loadSubscribers();

        this.searchInputControl.valueChanges
            .pipe(debounceTime(500))
            .subscribe((value) => {
                this.loadSubscribers(value?.toLowerCase() || '');
            });

        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                this.selectedSubscriber = null;
                this.cdr.markForCheck();
            }
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
    }

    // In the loadSubscribers method, after grouping by date:

    loadSubscribers(searchValue: string = ''): void {
        this.hotelService
            .getAllSubscriber({
                page: this.page,
                name: searchValue,
                pageSize: this.pageSize,
            })
            .subscribe({
                next: (response) => {
                    const allSubscriber = response.allData.map(
                        (subscriber) => ({
                            ...subscriber,
                            Date: new Date(subscriber.Date),
                        })
                    );

                    // Group by date
                    const groupedByDate = groupBy(allSubscriber, (subscriber) =>
                        subscriber.Date.toDateString()
                    );

                    // Get the dates and sort them in descending order
                    this.allSubscriber = Object.keys(groupedByDate)
                        .sort(
                            (a, b) =>
                                new Date(b).getTime() - new Date(a).getTime()
                        )
                        .map((date) => ({
                            date,
                            subscribers: groupedByDate[date],
                        }));

                    // Set the data source
                    this.dataSource.data = this.allSubscriber;
                    this.resultsLength = response.metadata.totalItems;
                    this.paginator?.firstPage();
                },
            });
    }

    onPageChange(event: PageEvent): void {
        this.page = event.pageIndex + 1; // Add 1 to align with 1-based indexing
        this.pageSize = event.pageSize;
        this.loadSubscribers(
            this.searchInputControl.value?.toLowerCase() || ''
        );
    }

    closeDrawer(): void {
        this.matDrawer.close();
    }

    onNameClick(subscriber: any): void {
        this.selectedSubscriber = subscriber;
        this.matDrawer.open();
        this.updateStatus(subscriber.id);
    }

    updateStatus(id: string): void {
        // Implement your logic to update the status here
        this.hotelService.updateStatus(id).subscribe(
            (response) => {
                this.loadSubscribers(
                    this.searchInputControl.value?.toLowerCase() || ''
                );
            },
            (error) => {
                console.error('Error updating status:', error);
            }
        );
    }
    handleDelete(subscriber: any): void {
        // Implement your logic to update the status here
        this.hotelService.deleteSubscriber(subscriber.id).subscribe(
            (response) => {
                this.loadSubscribers(
                    this.searchInputControl.value?.toLowerCase() || ''
                );
                this.matDrawer.close();
            },
            (error) => {
                console.error('Error updating status:', error);
            }
        );
    }

    openDialog(
        enterAnimationDuration: string,
        exitAnimationDuration: string
    ): void {
        this.dialog.open(SendMailComponent, {
            width: '50%',
            enterAnimationDuration,
            exitAnimationDuration,
        });
    }
}

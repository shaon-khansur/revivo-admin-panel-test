import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    AsyncPipe,
    CommonModule,
    I18nPluralPipe,
    NgClass,
    NgFor,
    NgIf,
    DOCUMENT,
} from '@angular/common';
import { DestinationService } from './../service/destination.service';
import {
    ActivatedRoute,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
    map,
    Observable,
    startWith,
    Subject,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Destination } from '../destination';
import { AddDestinationComponent } from '../add-destination/add-destination.component';

@Component({
    selector: 'app-destination-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterOutlet,
        FormsModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        AsyncPipe,
        I18nPluralPipe,
        NgClass,
        NgIf,
        NgFor,
    ],
    templateUrl: './destination-list.component.html',
    styleUrls: ['./destination-list.component.scss'],
})
export class DestinationListComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    destinations$: Observable<Destination[]>;
    filteredDestinations$: Observable<Destination[]>;

    destinationsCount: number = 0;
    filteredDestinationsCount: number = 0;
    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selecteddestinations: Destination;
    hebrewAlphabetOrder = [
        'א',
        'ב',
        'ג',
        'ד',
        'ה',
        'ו',
        'ז',
        'ח',
        'ט',
        'י',
        'כ',
        'ל',
        'מ',
        'נ',
        'ס',
        'ע',
        'פ',
        'צ',
        'ק',
        'ר',
        'ש',
        'ת',
    ];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _destinationsService: DestinationService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.destinations$ = this._destinationsService.destinations$;

        this.filteredDestinations$ = this.searchInputControl.valueChanges.pipe(
            startWith(''),
            switchMap((searchTerm) => this.filterDestinations(searchTerm)),
            tap((destinations) => this.updateFilteredCount(destinations))
        );

        this.destinations$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((destinations: Destination[]) => {
                this.destinationsCount = destinations.length;
                this._changeDetectorRef.markForCheck();
            });

        this._destinationsService.destination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((destination: Destination) => {
                this.selecteddestinations = destination;
                this._changeDetectorRef.markForCheck();
            });

        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                this.selecteddestinations = null;
                this._changeDetectorRef.markForCheck();
            }
        });

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                this.drawerMode = matchingAliases.includes('lg')
                    ? 'side'
                    : 'over';
                this._changeDetectorRef.markForCheck();
            });
    }

    filterDestinations(searchTerm: string): Observable<Destination[]> {
        if (!searchTerm) {
            // Return all destinations if search term is empty
            return this.destinations$.pipe(
                map((destinations) => this.sortDestinations(destinations))
            );
        }

        // Normalize the search term to lowercase
        const normalizedSearchTerm = searchTerm.toLowerCase();

        return this.destinations$.pipe(
            map((destinations) =>
                destinations.filter((destination) => {
                    const nameStartsWith = destination.name
                        .toLowerCase()
                        .startsWith(normalizedSearchTerm);
                    return (
                        nameStartsWith ||
                        destination.destinationId
                            .toLowerCase()
                            .startsWith(normalizedSearchTerm)
                    );
                })
            ),
            map((filteredDestinations) =>
                this.sortDestinations(filteredDestinations)
            )
        );
    }

    getHebrewAlphabetIndex(char: string): number {
        return this.hebrewAlphabetOrder.indexOf(char);
    }

    sortDestinations(destinations: Destination[]): Destination[] {
        return destinations.sort((a, b) => {
            const charA = a.name.charAt(0);
            const charB = b.name.charAt(0);
            const indexA = this.getHebrewAlphabetIndex(charA);
            const indexB = this.getHebrewAlphabetIndex(charB);
            return indexA - indexB;
        });
    }

    updateFilteredCount(destinations: Destination[]): void {
        this.filteredDestinationsCount = destinations.length;
        this._changeDetectorRef.markForCheck();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onBackdropClicked(): void {
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });
        this._changeDetectorRef.markForCheck();
    }

    createDestination(): void {
        const dialogConfig = new MatDialogConfig();
        this.dialog
            .open(AddDestinationComponent, dialogConfig)
            .afterClosed()
            .subscribe((res) => {
                if (res) {
                    this._destinationsService.getAllDestination().subscribe();
                }
            });
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}

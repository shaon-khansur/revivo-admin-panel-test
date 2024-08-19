import {
    AsyncPipe,
    CommonModule,
    DOCUMENT,
    I18nPluralPipe,
    NgClass,
    NgFor,
    NgIf,
} from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import {
    ActivatedRoute,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {
    map,
    Observable,
    startWith,
    Subject,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';
import { HotelService } from '../../hotel.service';

// Define a Hotel interface
interface Hotel {
    id: number;
    HotelID: number;
    HotelName: string;
    thumbnail?: string;
}

@Component({
    selector: 'app-hotel-list',
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
        MatPaginatorModule,
        MatIconModule,
        MatInputModule,
        AsyncPipe,
        I18nPluralPipe,
        NgClass,
        NgIf,
        NgFor,
    ],
    templateUrl: './hotel-list.component.html',
    styleUrls: ['./hotel-list.component.scss'],
})
export class HotelListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    hotelData$: Observable<Hotel[]>; // Use Hotel type
    filteredHotelData$: Observable<Hotel[]>; // Use Hotel type

    hotelsCount = 0;
    filteredHotelCount = 0;
    drawerMode: 'side' | 'over';
    searchInputControl = new UntypedFormControl();
    selectedHotel: Hotel | null = null; // Use Hotel type
    private _unsubscribeAll = new Subject<void>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private hotelService: HotelService,
        @Inject(DOCUMENT) private _document: Document,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.hotelData$ = this.hotelService.getAllHotels().pipe(
            tap((hotels) => {
                this.hotelsCount = hotels.length;
                this._changeDetectorRef.markForCheck();
            })
        );

        this.filteredHotelData$ = this.searchInputControl.valueChanges.pipe(
            startWith(''),
            switchMap((searchTerm) => this.filterHotels(searchTerm)),
            tap((hotels) => this.updateFilteredCount(hotels))
        );

        // Handle route parameters to set the selected hotel
        this._activatedRoute.params.subscribe((params) => {
            const hotelId = +params['hotelID']; // Ensure the ID is correctly parsed
            if (hotelId) {
                this.hotelService.getHotelById(hotelId).subscribe((hotel) => {
                    this.selectedHotel = hotel;
                    this._changeDetectorRef.markForCheck();
                });
            }
        });

        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                this.selectedHotel = null;
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

    filterHotels(searchTerm: string): Observable<Hotel[]> {
        if (!searchTerm) {
            return this.hotelData$.pipe(
                map((hotels) => this.sortHotels(hotels))
            );
        }

        const normalizedSearchTerm = searchTerm.toLowerCase();

        return this.hotelData$.pipe(
            map((hotels) =>
                hotels.filter((hotel) =>
                    hotel.HotelName.toLowerCase().startsWith(
                        normalizedSearchTerm
                    )
                )
            ),
            map((filteredHotels) => this.sortHotels(filteredHotels))
        );
    }

    sortHotels(hotels: Hotel[]): Hotel[] {
        return hotels.sort((a, b) => {
            const nameA = a.HotelName || '';
            const nameB = b.HotelName || '';
            return nameA.localeCompare(nameB);
        });
    }

    updateFilteredCount(hotels: Hotel[]): void {
        this.filteredHotelCount = hotels.length;
        this._changeDetectorRef.markForCheck();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onBackdropClicked(): void {
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });
        this._changeDetectorRef.markForCheck();
    }

    trackByFn(index: number, item: Hotel): any {
        return item.id || index;
    }
}

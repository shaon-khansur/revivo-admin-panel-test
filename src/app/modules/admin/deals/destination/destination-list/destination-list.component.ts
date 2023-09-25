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
  DOCUMENT
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
import { Observable, Subject, takeUntil, tap } from 'rxjs';
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
  styleUrls: ['./destination-list.component.scss']
})
export class DestinationListComponent implements OnInit {
  @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

  destinations$: Observable<Destination[]>;

  destinationsCount: number = 0;
  destinationsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
  drawerMode: 'side' | 'over';
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selecteddestinations: Destination;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
      private _activatedRoute: ActivatedRoute,
      private _changeDetectorRef: ChangeDetectorRef,
      private _destinationsService: DestinationService,
      @Inject(DOCUMENT) private _document: any,
      private _router: Router,
      private _fuseMediaWatcherService: FuseMediaWatcherService,
      private dialog: MatDialog
  )
  {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
      // Get the contacts
      this.destinations$ = this._destinationsService.destinations$;
      this._destinationsService.destinations$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((destinations: any) =>
          {
              // Update the counts
              this.destinationsCount = destinations.length;

              // Mark for check
              this._changeDetectorRef.markForCheck();
          });

      // Get the contact
      this._destinationsService.destination$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((destination: Destination) =>
          {
              // Update the selected contact
              this.selecteddestinations = destination;

              // Mark for check
              this._changeDetectorRef.markForCheck();
          });



      // Subscribe to MatDrawer opened change
      this.matDrawer.openedChange.subscribe((opened) =>
      {
          if ( !opened )
          {
              // Remove the selected contact when drawer closed
              this.selecteddestinations = null;

              // Mark for check
              this._changeDetectorRef.markForCheck();
          }
      });

      // Subscribe to media changes
      this._fuseMediaWatcherService.onMediaChange$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(({matchingAliases}) =>
          {
              // Set the drawerMode if the given breakpoint is active
              if ( matchingAliases.includes('lg') )
              {
                  this.drawerMode = 'side';
              }
              else
              {
                  this.drawerMode = 'over';
              }

              // Mark for check
              this._changeDetectorRef.markForCheck();
          });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On backdrop clicked
   */
  onBackdropClicked(): void
  {
      // Go back to the list
      this._router.navigate(['./'], {relativeTo: this._activatedRoute});

      // Mark for check
      this._changeDetectorRef.markForCheck();
  }

  createDestination(): void {
    const dialgoConfig = new MatDialogConfig();
    this.dialog
        .open(AddDestinationComponent, dialgoConfig)
        .afterClosed()
        .subscribe((res) => {
            if (res) {
                this._destinationsService.getAllDestination().subscribe();
            }
        });
}

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }
}

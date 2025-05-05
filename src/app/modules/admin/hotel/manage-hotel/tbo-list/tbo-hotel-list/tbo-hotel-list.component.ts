import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HotelService } from '../../../hotel.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
    MatPaginator,
    MatPaginatorModule,
    PageEvent,
} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime } from 'rxjs';
import {
    _MatSlideToggleRequiredValidatorModule,
    MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-tbo-hotel-list',
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
    RouterModule,
    _MatSlideToggleRequiredValidatorModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCheckboxModule,
],
  templateUrl: './tbo-hotel-list.component.html',
  styleUrls: ['./tbo-hotel-list.component.scss']
})
export class TboHotelListComponent implements OnInit {
  hotelList: any;
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [
      'hotelId',
      'hotelName',
      'HotelRate',
      'cityName',
      'cityCode',
      'isKosher',
      'view',
  ];

  allHotel: any[] = [];
  page: number = 1;
  pageSize: number = 10;
  resultsLength: number = 0;
  kosherStatusFilter: string | boolean = '';
  selectedKosherStatus: string = '';

  searchInputControl = new FormControl('');
  constructor(
      private hotelService: HotelService,
      private dialog: MatDialog,
      private router: Router,
      private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
      this.hotelService
          .getAllTBOHotels({
              page: this.page,
              hotelName: '',
              pageSize: this.pageSize,
              kosherStatus: this.kosherStatusFilter,
          })
          .subscribe({
              next: (response) => {
                  console.log(response);
                  this.allHotel = response.allData;
                  this.dataSource = new MatTableDataSource(this.allHotel);
                  this.resultsLength = response.metadata?.totalItems;
              },
          });

      this.searchInputControl.valueChanges
          .pipe(debounceTime(500))
          .subscribe((value) => {
              this.hotelService
                  .getAllTBOHotels({
                      page: 1, // Reset to page 1 when a search is performed
                      hotelName: value?.toLowerCase(),
                      pageSize: this.pageSize,
                  })
                  .subscribe({
                      next: (response) => {
                          this.allHotel = response.allData;
                          this.dataSource = new MatTableDataSource(
                              this.allHotel
                          );
                          this.resultsLength = response.metadata.totalItems;
                          this.paginator.firstPage(); // Reset paginator to the first page
                      },
                  });
          });
  }

  onKosherStatusChange(selectedValue: string): void {
      if (selectedValue === '') {
          this.kosherStatusFilter = '';
      } else if (selectedValue === 'true') {
          this.kosherStatusFilter = true; 
      } else if (selectedValue === 'false') {
          this.kosherStatusFilter = false; 
      }

      this.refreshHotelList();
  }

  getStars(rate: number): number[] {
      const fullStars = Math.floor(rate);
      const hasHalfStar = rate % 1 >= 0.5;
      const totalStars = 5; // assuming a 5-star rating system

      return Array(totalStars)
          .fill(0)
          .map((_, index) => {
              if (index < fullStars) {
                  return 1; // full star
              } else if (index === fullStars && hasHalfStar) {
                  return 0.5; // half star
              } else {
                  return 0; // empty star
              }
          });
  }

  ngAfterViewInit(): void {
      this.paginator.pageIndex = 0; // Angular Material paginator starts at 0
      this.resultsLength = 0;
      this.cdr.detectChanges();
  }

  onPageChange(event: PageEvent): void {
      this.page = event.pageIndex + 1; // Add 1 to align with 1-based indexing
      this.pageSize = event.pageSize;

      this.hotelService
          .getAllTBOHotels({
              page: this.page,
              hotelName: this.searchInputControl.value?.toLowerCase() || '',
              pageSize: this.pageSize,
              kosherStatus: this.kosherStatusFilter,
          })
          .subscribe({
              next: (response) => {
                  this.allHotel = response.allData;
                  this.dataSource = new MatTableDataSource(this.allHotel);
                  this.resultsLength = response.metadata.totalItems;
              },
          });
  }

  openDialog(hotel): void {
      this.router.navigate(['hotel/hotel-details', hotel.HotelCode, hotel.isKosher]);
  }

  createHotel(): void {
      this.router.navigate(['hotel/add-hotel']);
  }

  toggleKosher(hotelId: string, isKosher: boolean) {
      this.hotelService.toggleKosherStatus(hotelId, isKosher).subscribe({
          next: (response) => {
              if (response.success) {
                  this.refreshHotelList();
              } else {
                  console.error(
                      'Failed to update kosher status:',
                      response.message
                  );
              }
          },
          error: (error) => {
              console.error('Error updating kosher status:', error);
              // Log more detailed error information
              if (error.status) {
                  console.error('HTTP Status:', error.status);
              }
              if (error.message) {
                  console.error('Error Message:', error.message);
              }
              if (error.error) {
                  console.error('API Response Error:', error.error);
              }
          },
      });
  }

  refreshHotelList(): void {
      this.hotelService
          .getAllTBOHotels({
              page: this.page,
              hotelName: this.searchInputControl.value?.toLowerCase() || '',
              pageSize: this.pageSize,
              kosherStatus: this.kosherStatusFilter,
          })
          .subscribe({
              next: (response) => {
                  this.allHotel = response.allData;
                  this.dataSource = new MatTableDataSource(this.allHotel);
                  this.resultsLength = response.metadata.totalItems;
                  this.paginator.firstPage(); // Optional: Reset paginator to the first page
              },
              error: (error) => {
                  console.error('Error fetching hotel list:', error);
              },
          });
  }
}
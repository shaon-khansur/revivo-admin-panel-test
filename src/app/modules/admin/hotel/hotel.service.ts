import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';

interface HotelData {
    id: string;
    value: {
      HotelRate: number;
      HotelName: string;
      thumbnail?: string;
      Website?: string;
      file?: any; // Adjust this type based on your file structure
      Description?: string;
      AboutHotel?: string;
      HotelFacilities?: string[];
    };
  }

@Injectable({
    providedIn: 'root',
})
export class HotelService {
    constructor(private http: HttpClient) {}

    getAllHotels(data: {
        page: number;
        hotelName: string;
        pageSize: number;
    }): Observable<{
        allData: any[];
        metadata: {
            totalItems: number;
            totalPages: number;
            currentPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }> {
        // console.log('data', data);
        return this.http.get<{
            allData: any[];
            metadata: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            };
        }>(
            `${environment.baseUrl}hotelData?hotelName=${data.hotelName}&page=${data.page}&pageSize=${data.pageSize}`
        );
    }

    updateHotel(data: HotelData): Observable<any> {
        const url = `${environment.baseUrl}hotelData/${data.id}`;
        console.log(data);
        
    
        return this.http.put(url, data).pipe(
          catchError(error => {
            // Handle the error here
            console.error('Error updating hotel data:', error);
            return throwError(() => new Error('Error updating hotel data'));
          })
        );
      }
    getHotelById(id): Observable<any> {
        return this.http.get(`${environment.baseUrl}hotelData/${id}`);
    }
}

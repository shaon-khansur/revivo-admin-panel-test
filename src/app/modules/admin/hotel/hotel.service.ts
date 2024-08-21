import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

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

    updateHotel(data): Observable<any> {
        return this.http.put(
            `${environment.baseUrl}hotelData/${data.id}`,
            data.value
        );
    }
}

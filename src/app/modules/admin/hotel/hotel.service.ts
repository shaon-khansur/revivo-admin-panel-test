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
        kosherStatus?: string | boolean;
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
        // Start with the basic query parameters
        let queryParams = `hotelName=${data.hotelName}&page=${data.page}&pageSize=${data.pageSize}`;

        // Add the kosherStatus filter if it is defined
        if (data.kosherStatus !== undefined && data.kosherStatus !== '') {
            queryParams += `&status=${data.kosherStatus}`;
        }

        return this.http.get<{
            allData: any[];
            metadata: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            };
        }>(`${environment.baseUrl}hotelData?${queryParams}`);
    }
    getHotelById(id: string): Observable<any> {
        return this.http.get(`${environment.baseUrl}hotelData/${id}`);
    }
    getAllKosherHotels(data: {
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
            `${environment.baseUrl}kosherHotelData?hotelName=${data.hotelName}&page=${data.page}&pageSize=${data.pageSize}`
        );
    }

    updateKosherHotel(data: HotelData): Observable<any> {
        const url = `${environment.baseUrl}kosherHotelData/${data.id}`;
        console.log(data);

        return this.http.put(url, data).pipe(
            catchError((error) => {
                // Handle the error here
                console.error('Error updating hotel data:', error);
                return throwError(() => new Error('Error updating hotel data'));
            })
        );
    }
    getKosherHotelById(id: any): Observable<any> {
        return this.http.get(`${environment.baseUrl}kosherHotelData/${id}`);
    }
    getHotelImage(file: any): Observable<any> {
        return this.http.post(`${environment.baseUrl}UploadImage`, file);
    }
    toggleKosherStatus(hotelId: string, isKosher: boolean): Observable<any> {
        const url = `${environment.baseUrl}hotelData/toggleKosherStatus`;
        const body = { hotelId, isKosher };

        return this.http.post(url, body);
    }


    // tbo hotels
    getAllTBOHotels(data: {
        page: number;
        hotelName: string;
        pageSize: number;
        kosherStatus?: string | boolean;
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
        // Start with the basic query parameters
        let queryParams = `hotelName=${data.hotelName}&page=${data.page}&pageSize=${data.pageSize}`;

        console.log('data', data);

        // Add the kosherStatus filter if it is defined
        if (data.kosherStatus !== undefined && data.kosherStatus !== '') {
            queryParams += `&status=${data.kosherStatus}`;
        }

        return this.http.get<{
            allData: any[];
            metadata: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            };
        }>(`${environment.baseUrl}hotelData/hotels/tbo-hotels?${queryParams}`);
    }
    getTBOHotelById(id: string): Observable<any> {
        return this.http.get(
            `${environment.baseUrl}hotelData/hotels/tbo-hotels/${id}`
        );
    }
    addHotel(data: any): Observable<any> {
        return this.http.post<any>(`${environment.baseUrl}hotelData/hotels/tbo-hotels`, data);
    }
    updateHotel(data: HotelData, id: string): Observable<any> {
        const url = `${environment.baseUrl}hotelData/hotels/tbo-hotels/${id}`;
        console.log(data);

        return this.http.put(url, data).pipe(
            catchError((error) => {
                // Handle the error here
                console.error('Error updating hotel data:', error);
                return throwError(() => new Error('Error updating hotel data'));
            })
        );
    }

    // room data
    getRoomData(data: {
        page: number;
        roomNameSearch: string;
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
        // Start with the basic query parameters
        let queryParams = `roomNameSearch=${data.roomNameSearch}&page=${data.page}&pageSize=${data.pageSize}`;
        console.log('data', data);

        return this.http.get<{
            allData: any[];
            metadata: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            };
        }>(`${environment.baseUrl}roomMap?${queryParams}`);
    }
    updateRoom(data: any): Observable<any> {
        const url = `${environment.baseUrl}roomMap/${data.id}`;
        console.log(data);

        return this.http.put(url, data).pipe(
            catchError((error) => {
                // Handle the error here
                console.error('Error updating hotel data:', error);
                return throwError(() => new Error('Error updating hotel data'));
            })
        );
    }
}

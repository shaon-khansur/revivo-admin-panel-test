import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AirportService {
    constructor(private http: HttpClient) {}

    getAirports(data: { page: number; value: string }): Observable<{
        airports: any[];
        metadata: {
            totalItems: number;
            totalPages: number;
            currentPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }> {
        console.log('data', data)
        return this.http.get<{
            airports: any[];
            metadata: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            };
        }>(
            `${environment.baseUrl}insert/airports?page=${data.page}&value=${data.value}`
        );
    }


    updateAirport(data): Observable<any> {
        return this.http.put(`${environment.baseUrl}insert/airports/${data.id}`, data.value)
    }

    getInboundAirports(data: { page: number; value: string }): Observable<{
        airports: any[];
        metadata: {
            totalItems: number;
            totalPages: number;
            currentPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }> {
        console.log('data', data)
        return this.http.get<{
            airports: any[];
            metadata: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            };
        }>(
            `${environment.baseUrl}insert/airports?page=${data.page}&value=${data.value}`
        );
    }
}

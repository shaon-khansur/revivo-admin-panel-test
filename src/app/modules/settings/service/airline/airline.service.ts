import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AirlineService {
    constructor(private http: HttpClient) {}

    getAirlines(data: {
        page: number;
        name: string;
        code: string;
    }): Observable<{
        airlines: any[];
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
            airlines: any[];
            metadata: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            };
        }>(
            `${environment.baseUrl}airlines/search?name=${data.name}&code=${data.code}&page=${data.page}`
        );
    }
}

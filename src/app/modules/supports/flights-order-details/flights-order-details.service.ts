import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FlightsOrderDetailsService {
    constructor(private http: HttpClient) {}

    getFlightsOrder(data: { page: number; limit: number }): Observable<any> {
        return this.http.get<any>(
            `${environment.baseUrl}flights-order?page=${data.page}&limit=${data.limit}`
        );
    }

    searchFlightsOrder(data: {searchBy: string, value: string}) {
        return this.http.get<any>(
            `${environment.baseUrl}flights-order/search?${data.searchBy}=${data.value}`
        );
    }
}
